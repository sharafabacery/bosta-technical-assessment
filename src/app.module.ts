import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { Book } from './books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres', // or 'mssql' for SQL Server
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'bosta-technical-assessment',
      entities: [Book], 
      synchronize: true, 
      migrations: [__dirname + '/migrations/*.js'],
      migrationsRun: true, // This is the "automatic" trigger on startup
    }),BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
