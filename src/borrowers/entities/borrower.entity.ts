
import { BookBorrower } from 'src/book-borrowers/entities/book-borrower.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToMany } from 'typeorm';

@Entity()
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', 
    length: 255, 
    nullable: false})
  name: string;

  @Column({type: 'varchar', 
    length: 255, 
    nullable: false,unique: true})
    @Index()
  email: string;
  
  @Column({type: 'date', 
    nullable: false})
  registered: Date;
  
  @OneToMany(() => BookBorrower, (bb) => bb.borrower)
  bookBorrowers: BookBorrower[];
  
}
