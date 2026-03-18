import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from './entities/borrower.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@Injectable()
export class BorrowersService {
  constructor(
      @InjectRepository(Borrower)
      private borrowersRepository: Repository<Borrower>,
    ) {}
  async create(createBorrowerDto: CreateBorrowerDto) {
     try {
          return await this.borrowersRepository.save(this.borrowersRepository.create(createBorrowerDto));
        } catch (error) {
          if (error?.code === '23505' && error?.detail?.includes('email')) {
            throw new ConflictException(`A borrower with email ${createBorrowerDto.email} already exists.`);
          }
          throw error;
        }
  }

 async findAll(paginationDto: PaginationQueryDto) {
    const { page=1, limit=10 } = paginationDto;

   const qb = this.borrowersRepository.createQueryBuilder('borrower');

		// Apply pagination
		qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
		// Return both data and total count
		return{
    data,
    meta: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
  }

  async findOne(id: number) {
    const borrower = await this.borrowersRepository.findOne({ where: { id } });
        if (!borrower) {
          throw new NotFoundException(`Borrower with id ${id} not found`);
        }
        return borrower;
  }

  update(id: number, updateBorrowerDto: UpdateBorrowerDto) {
    return this.borrowersRepository.update({ id }, updateBorrowerDto);
  }

  async remove(id: number) {
    const { affected } = await this.borrowersRepository.delete({ id });
    if (affected === 0) {
			throw new NotFoundException(`Borrower with id ${id} not found`);
		}
  }
}
