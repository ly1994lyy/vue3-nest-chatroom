import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: process.env['DB_HOST'],
          port: Number(process.env['DB_PORT']),
          username: process.env['DB_USERNAME'],
          password: process.env['DB_PASSWORD'],
          database: process.env['DB_DATABASE'],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
