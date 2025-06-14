import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { IsAuthenticatedMiddleware } from './middlewares/is-authenticated.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    //MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => {
        const uri = ConfigService.getOrThrow<string>('MONGO_DB_URI');
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
    consumer
      .apply(IsAuthenticatedMiddleware)
      .exclude(
        {
          path: '/auth/sign-up',
          method: RequestMethod.POST,
        },
        { path: '/auth/sign-in', method: RequestMethod.POST },
      )
      .forRoutes('/');
  }
}
