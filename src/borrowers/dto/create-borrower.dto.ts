import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, MaxLength } from "class-validator";

export class CreateBorrowerDto {
@ApiPropertyOptional({ minLength: 1, maxLength: 255, description: 'name' })
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiPropertyOptional({ minLength: 1, maxLength: 255, description: 'email' })
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @ApiPropertyOptional({ minLength: 1, maxLength: 255, description: 'Registered date' })
    @IsNotEmpty()
    @MaxLength(255)
    registered: Date=new Date();

}
