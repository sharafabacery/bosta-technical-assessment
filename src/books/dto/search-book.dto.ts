import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

export class BookSearchDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsString()
  isbn?: string;
  @IsOptional()
  @IsString()
  author?: string;
}