import { Injectable } from '@nestjs/common';
import { BookBorrower } from 'src/book-borrowers/entities/book-borrower.entity';
import { ReadStream } from 'tty';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportService {
    constructor(private dataSource: DataSource) {}
    getStartAndEndOfMonth() {
        var now=new Date()
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed (0 = January)

        const startDate = new Date(year, month-1, 1); // First day of the month
        const endDate = new Date(year, month, 0); // Last day of the month (0th day of next month)
        return { startDate, endDate };
    }
    async queryInitialization(whereClause: string, parameters: any) {
        const queryBuilder = this.dataSource.getRepository(BookBorrower)
              .createQueryBuilder('bb')
              .innerJoin('bb.book', 'book')
              .innerJoin('bb.borrower', 'borrower')
              .where(whereClause, parameters)
              .select([
                    'bb.id AS id',
                    'bb.borrowedAt AS borrowed_at',
                    'book.title AS book_title',
                    'borrower.name AS borrower_name',
                    'bb.isReturned AS is_returned'
                    ]);
        return queryBuilder.stream();
    }
    async getBorrowedBooksInLastMonth() {
        const { startDate, endDate } = this.getStartAndEndOfMonth();
        return this.queryInitialization('bb.borrowedAt >= :fromDate AND bb.borrowedAt <= :toDate', { fromDate: startDate, toDate: endDate });
    }
    async getBorrowedBooksOverdueInLastMonth() {
        const { startDate, endDate } = this.getStartAndEndOfMonth();
        return this.queryInitialization('bb.overdue = true AND bb.borrowedAt >= :fromDate AND bb.borrowedAt <= :toDate', { fromDate: startDate, toDate: endDate });
    }
    async getBorrowedBooksInPeriod(fromDate: Date, toDate: Date) {
        return this.queryInitialization('bb.borrowedAt >= :fromDate AND bb.borrowedAt <= :toDate', { fromDate, toDate });
    }

}
