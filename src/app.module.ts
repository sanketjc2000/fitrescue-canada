import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createClient } from '@supabase/supabase-js';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserProfilesModule } from './user-profiles/user-profiles.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false, // Set to false in production, true for dev if needed but careful with existing schema
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    UserProfilesModule,
    SupabaseModule,
  ], // Make ConfigModule global env can be accessed anywhere
  providers: [
    AppService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const supabaseUrl=configService.get<string>('SUPABASE_URL')||'';
        const supabaseKey=configService.get<string>('SUPABASE_KEY')||'';

        if (!supabaseUrl||!supabaseKey) {
          throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables');
        }

        return createClient(supabaseUrl, supabaseKey);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['SUPABASE_CLIENT'],
  controllers: [AppController],
})
export class AppModule { }
