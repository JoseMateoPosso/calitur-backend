import { Test, TestingModule } from '@nestjs/testing';
import { TouristSpotsService } from './tourist-spots.service';

describe('TouristSpotsService', () => {
  let service: TouristSpotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TouristSpotsService],
    }).compile();

    service = module.get<TouristSpotsService>(TouristSpotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
