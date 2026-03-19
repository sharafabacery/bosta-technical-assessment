import { BadRequestException, Controller, Get, Query, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import { CsvStreamService } from './CsvStreamService.service';
import express from 'express'; // Explicitly from express
import { 
  ApiTags, 
  ApiOperation, 
  ApiQuery, 
  ApiResponse, 
  ApiProduces 
} from '@nestjs/swagger';

@ApiTags('Reports') // Groups these in the Swagger UI
@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly csvService: CsvStreamService,
  ) {}

  @Get('getBorrowedBooksInPeriod')
  @ApiOperation({ summary: 'Export borrowed books within a specific date range' })
  @ApiProduces('text/csv')
  @ApiQuery({ name: 'fromDate', example: '2023-01-01', description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'toDate', example: '2023-12-31', description: 'End date (ISO 8601)' })
  @ApiResponse({ 
    status: 200, 
    description: 'CSV file containing the report.',
    schema: { type: 'string', format: 'binary' } 
  })
  async getBorrowedBooksInPeriod(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Res() res: express.Response,
  ) {
    if (!fromDate || !toDate) {
      throw new BadRequestException('fromDate and toDate are required');
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    const dataStream = await this.reportService.getBorrowedBooksInPeriod(fromDateObj, toDateObj);
    const fileName = `report-${fromDate}-to-${toDate}`;

    return this.csvService.streamToResponse(res, fileName, dataStream);
  }

  @Get('getBorrowedBooksInLastMonth')
  @ApiOperation({ summary: 'Export all books borrowed in the last 30 days' })
  @ApiProduces('text/csv')
  @ApiResponse({ 
    status: 200, 
    description: 'CSV file download',
    schema: { type: 'string', format: 'binary' } 
  })
  async getBorrowedBooksInLastMonth(@Res() res: express.Response) {
    const dataStream = await this.reportService.getBorrowedBooksInLastMonth();
    const fileName = `report-borrowed-last-month`;
    return this.csvService.streamToResponse(res, fileName, dataStream);
  }

  @Get('getBorrowedBooksOverdueInLastMonth')
  @ApiOperation({ summary: 'Export books that are overdue from last month' })
  @ApiProduces('text/csv')
  @ApiResponse({ 
    status: 200, 
    description: 'CSV file download',
    schema: { type: 'string', format: 'binary' } 
  })
  async getBorrowedBooksOverdueInLastMonth(@Res() res: express.Response) {
    const dataStream = await this.reportService.getBorrowedBooksOverdueInLastMonth();
    const fileName = `report-overdue-last-month`;
    return this.csvService.streamToResponse(res, fileName, dataStream);
  }
}