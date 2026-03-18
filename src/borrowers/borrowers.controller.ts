import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('borrowers')
@Controller('borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @ApiOperation({ summary: 'Create a new Borrower' })
  @ApiResponse({ status: 201, description: 'Borrower created successfully.' })
  @ApiResponse({ status: 409, description: 'Conflict: Borrower with this email already exists.' })
  @Post()
  create(@Body() createBorrowerDto: CreateBorrowerDto) {
    return this.borrowersService.create(createBorrowerDto);
  }

  @ApiOperation({ summary: 'Get all borrowers with pagination' })
  @ApiResponse({ status: 200, description: 'Return paginated borrowers.' })
  @Get()
  findAll(@Query() paginationDto: PaginationQueryDto) {
    return this.borrowersService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a borrower by ID' })
  @ApiResponse({ status: 200, description: 'Return the requested borrower.' })
  @ApiResponse({ status: 404, description: 'Borrower not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a borrower' })
  @ApiResponse({ status: 200, description: 'Borrower updated successfully.' })
  @ApiResponse({ status: 404, description: 'Borrower not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowerDto: UpdateBorrowerDto) {
    return this.borrowersService.update(+id, updateBorrowerDto);
  }
  
  @ApiOperation({ summary: 'Delete a borrower' })
  @ApiResponse({ status: 200, description: 'Borrower deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Borrower not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowersService.remove(+id);
  }
}
