import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
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
