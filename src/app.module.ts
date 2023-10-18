import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ComponentController } from './component/component.controller';
import { AwsService } from './aws.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, ComponentController],
  providers: [AppService, AwsService],
})
export class AppModule {}
