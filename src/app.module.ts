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
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true, // This makes the module available everywhere
      secret: 'DO-NOT-USE-THIS-SECRET-IN-PRODUCTION',
      signOptions: { expiresIn: '60s' },
    }),
    // 1. Initialize ConfigModule
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: seconds(1),
        limit: 3, // 3 requests per second
      },
      {
        name: 'long',
        ttl: seconds(60),
        limit: 100, // 100 requests per minute
      },
    ]),
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
    BookBorrowersModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,{
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Apply globally to all routes
    },],
})
export class AppModule {}
