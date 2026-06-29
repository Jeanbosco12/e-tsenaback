import { Test, TestingModule } from '@nestjs/testing';
import { MercantController } from './mercant.controller';

describe('MercantController', () => {
  let controller: MercantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MercantController],
    }).compile();

    controller = module.get<MercantController>(MercantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
