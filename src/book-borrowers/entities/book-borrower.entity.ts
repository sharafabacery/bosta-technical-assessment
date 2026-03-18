import { Book } from 'src/books/entities/book.entity';
import { Borrower } from 'src/borrowers/entities/borrower.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class BookBorrower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date;

  @Column({ default: false })
  isReturned: boolean; 
  
   @Column({ default: false })
   overdue: boolean; 

  @ManyToOne(() => Book, (book) => book.bookBorrowers)
  book: Book;

  @ManyToOne(() => Borrower, (borrower) => borrower.bookBorrowers)
  borrower: Borrower;
}