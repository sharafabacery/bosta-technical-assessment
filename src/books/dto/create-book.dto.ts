import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MaxLength, Min } from 'class-validator';
export class CreateBookDto {
    @ApiPropertyOptional({ minLength: 1, maxLength: 255, description: 'title' })
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @ApiPropertyOptional({ minLength: 1, maxLength: 255, description: 'author' })
    @IsNotEmpty()
    @MaxLength(255)
    author: string;

    @ApiPropertyOptional({ minLength: 1, maxLength: 255, description: 'ISBN' })
    @IsNotEmpty()
    @MaxLength(255)
    isbn: string;

    @ApiPropertyOptional({ minLength: 1, maxLength: 255, description: 'Shelf location' })
    @IsNotEmpty()
    @MaxLength(255)
    shelf: string;

    @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Quantity' })
    @IsInt()
    @Min(1)   
    quantity: number=1;
}
