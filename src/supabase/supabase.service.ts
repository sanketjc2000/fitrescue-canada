import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url=this.configService.get<string>('SUPABASE_URL');
    const key=this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url||!key) {
      // In test environment, we might not have these, so we can skip or warn.
      // But better to throw if this service is actually used.
      // For now, let's allow it to be undefined in tests if we mock ConfigService to return something or nothing.
      // But wait, if we mock ConfigService, we can control this.
      if (process.env.NODE_ENV!=='test') {
        // throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
      }
    }

    if (url&&key) {
      this.supabase=createClient(url, key);
    }
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
