import { Controller, Get, Post, Body, Patch, Param, Delete,Query, UseGuards } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('borrowers -Auth Required')
@Controller('borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @ApiOperation({ summary: 'Create a new Borrower' })
  @ApiResponse({ status: 201, description: 'Borrower created successfully.' })
  @ApiResponse({ status: 409, description: 'Conflict: Borrower with this email already exists.' })
  @UseGuards(AuthGuard) 
  @Post()
  create(@Body() createBorrowerDto: CreateBorrowerDto) {
    return this.borrowersService.create(createBorrowerDto);
  }

  @ApiOperation({ summary: 'Get all borrowers with pagination' })
  @ApiResponse({ status: 200, description: 'Return paginated borrowers.' })
  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() paginationDto: PaginationQueryDto) {
    return this.borrowersService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a borrower by ID' })
  @ApiResponse({ status: 200, description: 'Return the requested borrower.' })
  @ApiResponse({ status: 404, description: 'Borrower not found.' })
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.borrowersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a borrower' })
  @ApiResponse({ status: 200, description: 'Borrower updated successfully.' })
  @ApiResponse({ status: 404, description: 'Borrower not found.' })
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() updateBorrowerDto: UpdateBorrowerDto) {
    return this.borrowersService.update(+id, updateBorrowerDto);
  }
  
  @ApiOperation({ summary: 'Delete a borrower' })
  @ApiResponse({ status: 200, description: 'Borrower deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Borrower not found' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number) {
    return this.borrowersService.remove(+id);
  }
}
