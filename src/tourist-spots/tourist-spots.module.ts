import { Module } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { TouristSpotsController } from './tourist-spots.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [StorageModule, JwtModule, PrismaModule],
  providers: [TouristSpotsService],
  controllers: [TouristSpotsController]
})
export class TouristSpotsModule {}
