import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowersService } from './book-borrowers.service';

describe('BookBorrowersService', () => {
  let service: BookBorrowersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookBorrowersService],
    }).compile();

    service = module.get<BookBorrowersService>(BookBorrowersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
