import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://zavradashvilizeko:lKP4RtfzhRrxmfcv@cluster1.fabhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'),
    UserModule,
  ],
})
export class AppModule {}
