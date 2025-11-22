import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';

import { ConfigService } from '@nestjs/config';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule=await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: 'SUPABASE_CLIENT',
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-value'),
          },
        },
      ],
    }).compile();

    service=module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
