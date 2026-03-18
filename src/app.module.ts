import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { Book } from './books/entities/book.entity';
import { BorrowersModule } from './borrowers/borrowers.module';
import { Borrower } from './borrowers/entities/borrower.entity';
import { BookBorrowersModule } from './book-borrowers/book-borrowers.module';
import { BookBorrower } from './book-borrowers/entities/book-borrower.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 1. Initialize ConfigModule
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),

    // 2. Initialize TypeOrmModule Async
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Book, Borrower, BookBorrower],
        
        // Safety settings
        synchronize: config.get<string>('NODE_ENV') === 'development', 
        migrations: [__dirname + '/migrations/*.js'],
        migrationsRun: true,
      }),
    }),

    // 3. Feature Modules
    BooksModule, 
    BorrowersModule, 
    BookBorrowersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
