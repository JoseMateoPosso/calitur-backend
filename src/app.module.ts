import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TouristSpotsModule } from './tourist-spots/tourist-spots.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StorageModule } from './storage/storage.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, UsersModule, TouristSpotsModule, AuthModule, ReviewsModule, StorageModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
