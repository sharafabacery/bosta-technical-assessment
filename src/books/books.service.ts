import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { BookSearchDto } from './dto/search-book.dto';
import { ILike } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto) {
    try {
			return await this.booksRepository.save(this.booksRepository.create(createBookDto));
		} catch (error) {
			if (error?.code === '23505' && error?.detail?.includes('isbn')) {
				throw new ConflictException(`A book with ISBN ${createBookDto.isbn} already exists.`);
			}
			throw error;
		}
    
  }

  async findAll(searchDto: BookSearchDto) {
    const { page=1, limit=10,title,isbn,author } = searchDto;

   const qb = this.booksRepository.createQueryBuilder('book');

		// Apply filters
		if (title) {
			qb.andWhere('LOWER(book.title) LIKE LOWER(:title)', {
				title: `%${title}%`,
			});
		}
		if (author) {
			qb.andWhere('LOWER(book.author) LIKE LOWER(:author)', {
				author: `%${author}%`,
			});
		}
		if (isbn) {
			qb.andWhere('book.isbn = :isbn', { isbn: isbn });
		}



		// Apply pagination
		qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
		// Return both data and total count
		return{
    data,
    meta: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
  }

  async findOne(id: number): Promise<Book | null> {
    const book = await this.booksRepository.findOne({ where: { id } });
		if (!book) {
			throw new NotFoundException(`Book with id ${id} not found`);
		}
		return book;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return this.booksRepository.update({ id }, updateBookDto);
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.booksRepository.delete({ id });
    if (affected === 0) {
			throw new NotFoundException(`Book with id ${id} not found`);
		}
  }
}
