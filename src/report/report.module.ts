import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CsvStreamService } from './CsvStreamService.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService,CsvStreamService],
})
export class ReportModule {}
