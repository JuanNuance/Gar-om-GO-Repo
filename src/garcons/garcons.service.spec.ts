import { Test, TestingModule } from '@nestjs/testing';
import { GarconsService } from './garcons.service';

describe('GarconsService', () => {
  let service: GarconsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GarconsService],
    }).compile();

    service = module.get<GarconsService>(GarconsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
