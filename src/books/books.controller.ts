import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookSearchDto } from './dto/search-book.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully.' })
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }
  
  @ApiOperation({ summary: 'Get all books with pagination and search' })
  @ApiResponse({ status: 200, description: 'Return paginated books.' })
  @ApiResponse({ status: 409, description: 'Conflict: Book with this ISBN already exists.' })
  @Get()
  findAll(@Query() searchDto: BookSearchDto) {
    return this.booksService.findAll(searchDto);
  }

  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
