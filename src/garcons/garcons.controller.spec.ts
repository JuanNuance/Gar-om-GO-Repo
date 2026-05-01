import { Test, TestingModule } from '@nestjs/testing';
import { GarconsController } from './garcons.controller';

describe('GarconsController', () => {
  let controller: GarconsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GarconsController],
    }).compile();

    controller = module.get<GarconsController>(GarconsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
