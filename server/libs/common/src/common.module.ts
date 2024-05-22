import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@app/db';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env['JWT_SECRET'],
          global: true,
        };
      },
    }),
    DbModule,
  ],
  providers: [CommonService],
  exports: [CommonService, JwtModule],
})
export class CommonModule {}
