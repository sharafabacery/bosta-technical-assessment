import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, isNumber, MaxLength, Min } from 'class-validator';

export class CreateBookBorrowerDto {
    @ApiPropertyOptional({ required: true, description: 'bookId' })
    @IsNotEmpty()
    @IsInt()
    bookId: number;

    @ApiPropertyOptional({ required: true, description: 'borrowerId' })
    @IsNotEmpty()
    @IsInt()
    borrowerId: number;

    @ApiPropertyOptional({ required: true, description: 'borrowedAt'  })
    @IsNotEmpty()
    borrowedAt: Date;
    
    @ApiPropertyOptional({ required: true, description: 'returnedAt'  })
    @IsNotEmpty()
    returnedAt: Date;
}
