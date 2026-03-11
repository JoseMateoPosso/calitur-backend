import { Module } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { TouristSpotsController } from './tourist-spots.controller';

@Module({
  providers: [TouristSpotsService],
  controllers: [TouristSpotsController]
})
export class TouristSpotsModule {}
