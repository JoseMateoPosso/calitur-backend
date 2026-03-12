import { Module } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { TouristSpotsController } from './tourist-spots.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [TouristSpotsService],
  controllers: [TouristSpotsController]
})
export class TouristSpotsModule {}
