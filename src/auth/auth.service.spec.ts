import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule=await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'SUPABASE_CLIENT',
          useValue: {},
        },
        {
          provide: SupabaseService,
          useValue: {
            client: {
              auth: {
                signUp: jest.fn(),
                signInWithPassword: jest.fn(),
                resetPasswordForEmail: jest.fn(),
                signInWithOAuth: jest.fn(),
              },
            },
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service=module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signupWithEmail', () => {
    it('should throw ConflictException if user already exists', async () => {
      const email='test@example.com';
      const password='password';
      const mockUser={ id: '123', email };

      // Mock Supabase success
      const supabaseService=module.get(SupabaseService);
      (supabaseService.client.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Mock UsersService failure
      const usersService=module.get(UsersService);
      const conflictError: any=new Error('Duplicate key');
      conflictError.code='23505';
      (usersService.create as jest.Mock).mockRejectedValue(conflictError);

      await expect(service.signupWithEmail(email, password)).rejects.toThrow(ConflictException);
    });
  });
});
