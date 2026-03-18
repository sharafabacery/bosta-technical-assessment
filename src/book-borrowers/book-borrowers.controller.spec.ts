import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowersController } from './book-borrowers.controller';
import { BookBorrowersService } from './book-borrowers.service';

describe('BookBorrowersController', () => {
  let controller: BookBorrowersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookBorrowersController],
      providers: [BookBorrowersService],
    }).compile();

    controller = module.get<BookBorrowersController>(BookBorrowersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
