import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async signupWithEmail(email: string, password: string) {
        const { data, error }=await this.supabaseService.client.auth.signUp({
            email,
            password,
        });

        if (error) throw new UnauthorizedException(error.message);
        return { message: 'Signup successful', user: data.user, };
    }

    async loginWithEmail(email: string, password: string) {
        const { data, error }=await this.supabaseService.client.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new UnauthorizedException(error.message);
        return { message: 'Login successful', user: data.user, token: data.session?.access_token };
    }

    async loginWithGoogle() {
        const { data, error }=await this.supabaseService.client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.GOOGLE_REDIRECT_URL,
            },
        });

        if (error) throw new UnauthorizedException(error.message);
        return { url: data.url }; // redirect user to this URL in frontend
    }

    async loginWithApple() {
        const { data, error }=await this.supabaseService.client.auth.signInWithOAuth({
            provider: 'apple',
            options: {
                redirectTo: process.env.APPLE_REDIRECT_URL,
            },
        });

        if (error) throw new UnauthorizedException(error.message);
        return { url: data.url };
    }
}
