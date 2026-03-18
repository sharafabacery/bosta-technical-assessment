
import { BookBorrower } from 'src/book-borrowers/entities/book-borrower.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToMany } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', 
    length: 255, 
    nullable: false})
  title: string;

  @Column({type: 'varchar', 
    length: 255, 
    nullable: false})
  author: string;
  
  @Index()
  @Column({ length: 25,unique: true,nullable: false })
  isbn: string;

  @Column({type: 'int', 
    nullable: false})
  quantity: number;
  
  @Column({type: 'varchar', 
    length: 255, 
    nullable: false})
  shelf: string;
  @OneToMany(() => BookBorrower, (bb) => bb.book)
  bookBorrowers: BookBorrower[];
}
