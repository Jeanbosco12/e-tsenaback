import { Test, TestingModule } from '@nestjs/testing';
import { MercantService } from './mercant.service';

describe('MercantService', () => {
  let service: MercantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MercantService],
    }).compile();

    service = module.get<MercantService>(MercantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
