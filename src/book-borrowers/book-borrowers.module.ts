import { Module } from '@nestjs/common';
import { BookBorrowersService } from './book-borrowers.service';
import { BookBorrowersController } from './book-borrowers.controller';

@Module({
  controllers: [BookBorrowersController],
  providers: [BookBorrowersService],
})
export class BookBorrowersModule {}
