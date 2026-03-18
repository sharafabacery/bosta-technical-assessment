import { Test, TestingModule } from '@nestjs/testing';
import { BorrowersService } from './borrowers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Borrower } from './entities/borrower.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BorrowersService', () => {
  let service: BorrowersService;
  let repository: Repository<Borrower>;

  // Mock Repository Factory
  const mockBorrowersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowersService,
        {
          provide: getRepositoryToken(Borrower),
          useValue: mockBorrowersRepository,
        },
      ],
    }).compile();

    service = module.get<BorrowersService>(BorrowersService);
    repository = module.get<Repository<Borrower>>(getRepositoryToken(Borrower));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a borrower', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com' };
      mockBorrowersRepository.create.mockReturnValue(dto);
      mockBorrowersRepository.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto as any);
      expect(result).toEqual({ id: 1, ...dto });
      expect(repository.save).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if email exists (Postgres code 23505)', async () => {
      const dto = { email: 'exists@test.com' };
      mockBorrowersRepository.save.mockRejectedValue({
        code: '23505',
        detail: 'Key (email)=(exists@test.com) already exists.',
      });

      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const mockData = [{ id: 1, name: 'User' }];
      const mockTotal = 1;

      // Mocking the QueryBuilder chain
      const qb = mockBorrowersRepository.createQueryBuilder();
      qb.getManyAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await service.findAll(paginationDto as any);

      expect(result.data).toEqual(mockData);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a borrower if found', async () => {
      const mockUser = { id: 1, name: 'Test' };
      mockBorrowersRepository.findOne.mockResolvedValue(mockUser);

      expect(await service.findOne(1)).toEqual(mockUser);
    });

    it('should throw NotFoundException if borrower does not exist', async () => {
      mockBorrowersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a borrower if it exists', async () => {
      mockBorrowersRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if nothing was deleted', async () => {
      mockBorrowersRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});