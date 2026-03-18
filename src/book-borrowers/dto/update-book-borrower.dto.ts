import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBookBorrowerDto } from './create-book-borrower.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateBookBorrowerDto {
        @ApiPropertyOptional({ required: true, description: 'bookId' })
        @IsNotEmpty()
        @IsInt()
        bookId: number;
    
        @ApiPropertyOptional({ required: true, description: 'borrowerId' })
        @IsNotEmpty()
        @IsInt()
        borrowerId: number;
}
