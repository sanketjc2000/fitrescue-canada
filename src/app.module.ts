import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule], // Make ConfigModule global env can be accessed anywhere
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
    SupabaseService,
  ],
  exports: ['SUPABASE_CLIENT',SupabaseService],
  controllers: [AppController],
})
export class AppModule { }
