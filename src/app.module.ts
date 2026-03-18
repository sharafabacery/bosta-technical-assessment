import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { Book } from './books/entities/book.entity';
import { BorrowersModule } from './borrowers/borrowers.module';
import { Borrower } from './borrowers/entities/borrower.entity';
import { BookBorrowersModule } from './book-borrowers/book-borrowers.module';
import { BookBorrower } from './book-borrowers/entities/book-borrower.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres', // or 'mssql' for SQL Server
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'bosta-technical-assessment',
      entities: [Book,Borrower,BookBorrower], 
      synchronize: true, 
      migrations: [__dirname + '/migrations/*.js'],
      migrationsRun: true, // This is the "automatic" trigger on startup
    }),BooksModule, BorrowersModule, BookBorrowersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
