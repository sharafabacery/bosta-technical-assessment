import { Controller, Get, Post, Body, Patch, Param, Delete ,Query, BadRequestException, UseGuards} from '@nestjs/common';
import { BookBorrowersService } from './book-borrowers.service';
import { CreateBookBorrowerDto } from './dto/create-book-borrower.dto';
import { UpdateBookBorrowerDto } from './dto/update-book-borrower.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('BorrowingProcess - Auth Required')
@Controller('BorrowingProcess')
export class BookBorrowersController {
  constructor(private readonly bookBorrowersService: BookBorrowersService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully.' })
  @ApiResponse({ status: 409, description: 'Book out of stock.' })
  @Throttle({ default: { limit: 1, ttl: 10000 } })
  @UseGuards(AuthGuard)
  create(@Body() createBookBorrowerDto: CreateBookBorrowerDto) {
    return this.bookBorrowersService.borrowBook(createBookBorrowerDto);
  }

  @Get(':id/borrowed-books')
  @ApiOperation({ summary: 'Get all books borrowed by a specific user' })
  @ApiResponse({ status: 200, description: 'Returns a list of books with borrow metadata.' })
  @Throttle({ default: { limit: 1, ttl: 10000 } })
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.bookBorrowersService.getBorrowedBooks(+id);
  }

  @Patch('borrow/:id')
  @ApiOperation({ summary: 'make book return' })
  @UseGuards(AuthGuard)
  update(@Param('id') id: number) {
    return this.bookBorrowersService.borrowBookReturn(+id);
  }

  @Get('overdue-or-late')
  @ApiOperation({ summary: 'Get paginated list of overdue or late returns' })
  @ApiQuery({ name: 'targetDate', type: 'string', example: '2026-03-01T00:00:00Z', description: 'ISO Date string to compare against returnedAt' })
  @ApiResponse({ status: 200, description: 'Returns paginated book and borrower names.' })
  @UseGuards(AuthGuard)
  getOverdueRecords(
    @Query('targetDate') targetDateString: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    // Validate the date string
    if (!targetDateString) {
      throw new BadRequestException('targetDate query parameter is required');
    }

    const targetDate = new Date(targetDateString);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid targetDate format. Use ISO 8601 (e.g., YYYY-MM-DD)');
    }

    return this.bookBorrowersService.getPaginatedOverdueRecords(targetDate, paginationQuery);
  }
}
