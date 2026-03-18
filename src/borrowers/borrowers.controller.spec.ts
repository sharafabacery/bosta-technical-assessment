import { Test, TestingModule } from '@nestjs/testing';
import { BorrowersController } from './borrowers.controller';
import { BorrowersService } from './borrowers.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';

describe('BorrowersController', () => {
  let controller: BorrowersController;
  let service: BorrowersService;

  // Mock Service Factory
  const mockBorrowersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowersController],
      providers: [
        {
          provide: BorrowersService,
          useValue: mockBorrowersService,
        },
        // We mock JwtService because AuthGuard depends on it
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BorrowersController>(BorrowersController);
    service = module.get<BorrowersService>(BorrowersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call service.create with correct data', async () => {
      const dto = { name: 'Test User', email: 'test@test.com' };
      mockBorrowersService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll()', () => {
    it('should call service.findAll with pagination query', async () => {
      const query = { page: 1, limit: 5 };
      const expectedResponse = { data: [], meta: {} };
      mockBorrowersService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query as any);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toBe(expectedResponse);
    });
  });

  describe('findOne()', () => {
    it('should call service.findOne and convert id to number', async () => {
      const id = '5';
      mockBorrowersService.findOne.mockResolvedValue({ id: 5 });

      await controller.findOne(id as any);

      expect(service.findOne).toHaveBeenCalledWith(5);
    });
  });

  describe('remove()', () => {
    it('should call service.remove', async () => {
      mockBorrowersService.remove.mockResolvedValue(undefined);

      await controller.remove(10);

      expect(service.remove).toHaveBeenCalledWith(10);
    });
  });
});