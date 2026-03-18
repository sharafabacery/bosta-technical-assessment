import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookBorrowerDto } from './dto/create-book-borrower.dto';
import { UpdateBookBorrowerDto } from './dto/update-book-borrower.dto';
import { DataSource } from 'typeorm/data-source/index.js';
import { Borrower } from 'src/borrowers/entities/borrower.entity';
import { Book } from 'src/books/entities/book.entity';
import { BookBorrower } from './entities/book-borrower.entity';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { Brackets } from 'typeorm';

@Injectable()
export class BookBorrowersService {
  constructor(private dataSource: DataSource) {}
async borrowBook(createBookBorrowerDto: CreateBookBorrowerDto) {
    // Start a transaction to ensure atomicity
    return await this.dataSource.transaction(async (manager) => {
      
      // 1. Check if Borrower exists
      const borrower = await manager.findOne(Borrower, { where: { id: createBookBorrowerDto.borrowerId } });
      if (!borrower) throw new NotFoundException('Borrower not found');

      // 2. Check if Book exists and LOCK the row for concurrent safety
      const book = await manager.findOne(Book, {
        where: { id: createBookBorrowerDto.bookId },
        lock: { mode: 'pessimistic_write' }, // Prevents other transactions from reading/writing this row
      });
      if (!book) throw new NotFoundException('Book not found');

      // 3. Calculate currently borrowed (unreturned) copies
      const borrowedCount = await manager.count(BookBorrower, {
        where: { 
          book: { id: createBookBorrowerDto.bookId },
          isReturned: false // Only count those not yet returned
        },
      });

      // 4. Check availability
      if (borrowedCount >= book.quantity) {
        throw new ConflictException(`All copies of "${book.title}" are currently borrowed.`);
      }

      // 5. Check if THIS specific user already has an unreturned copy of THIS book
      const existingBorrow = await manager.findOne(BookBorrower, {
        where: {
          book: { id: createBookBorrowerDto.bookId },
          borrower: { id: createBookBorrowerDto.borrowerId },
          isReturned:false
        }
      });
      if (existingBorrow) {
        throw new BadRequestException('You already have an active borrow for this book.');
      }

      // 6. Save the transaction record
      const newRecord = manager.create(BookBorrower, {
        book: book,
        borrower: borrower,
        borrowedAt: createBookBorrowerDto.borrowedAt ,
        returnedAt: createBookBorrowerDto.returnedAt,
        isReturned: false,
      });

      return await manager.save(newRecord);
    });
  }
  async borrowBookReturn(id: number) {
    const borrowRecord = await this.dataSource.getRepository(BookBorrower).findOne({
      where: { id: id },
      relations: ['book', 'borrower'],
    });
    if (!borrowRecord) {
      throw new NotFoundException('Borrow record not found');
    }
    borrowRecord.isReturned=true;
    if(new Date() > borrowRecord.returnedAt) {
      borrowRecord.overdue = true;
    }
    await this.dataSource.getRepository(BookBorrower).save(borrowRecord);
    return borrowRecord;
  }
  async getBorrowedBooks(borrowerId: number) {
    const borrower = await this.dataSource.getRepository(Borrower).findOne({
      where: { id: borrowerId,bookBorrowers: { isReturned: false } }, // Only fetch borrowers with active borrows
      relations: [
        'bookBorrowers',           // The junction table records
        'bookBorrowers.book'       // The actual Book entities inside those records
      ],
    });

    if (!borrower) {
      throw new NotFoundException(`Borrower with ID ${borrowerId} not found`);
    }

    // Optional: Flatten the response so it's easier for the frontend to use
    const books = borrower.bookBorrowers.map((record) => ({
      ...record.book,
      borrowedAt: record.borrowedAt,
      returnedAt: record.returnedAt,
      isReturned: record.isReturned
    }));

    return {
      borrowerName: borrower.name,
      books: books
    };
  }

  async getPaginatedOverdueRecords(targetDate: Date, paginationQuery: PaginationQueryDto) {
    // 1. Destructure with defaults
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    // 2. Build the query
    const queryBuilder = this.dataSource.getRepository(BookBorrower)
      .createQueryBuilder('bb')
      .innerJoin('bb.book', 'book')
      .innerJoin('bb.borrower', 'borrower')
      .where('bb.returnedAt < :targetDate', { targetDate })
      .andWhere('bb.isReturned = :isReturned', { isReturned: false }); 

    // 3. Get total count for pagination metadata
    const total = await queryBuilder.getCount();

    // 4. Fetch the specific paginated data
    const data = await queryBuilder
      .select([
        'book.title AS "bookName"',
        'borrower.name AS "borrowerName"'
      ])
      .offset(skip) // equivalent to skip in QueryBuilder
      .limit(limit) // equivalent to take in QueryBuilder
      .getRawMany();

    // 5. Return structured response
    return {
      data,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
}
