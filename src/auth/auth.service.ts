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
        if (!data.user) throw new UnauthorizedException('Signup failed. Try again later.');

        return {
            message: 'Signup successful',
            user: data.user,
        };
    }

    async loginWithEmail(email: string, password: string) {
        const { data, error }=await this.supabaseService.client.auth.signInWithPassword({
            email,
            password,
        });

        // Check if the login itself failed (e.g., wrong password)
        if (error||!data.session) {
            throw new UnauthorizedException(error?.message||'Login failed. Invalid credentials.');
        }


        return {
            message: 'Login successful',
            session: data.session,
            user: data.user,
        };
    }

    async sendPasswordReset(email: string) {
        const { data, error }=await this.supabaseService.client.auth.resetPasswordForEmail(email, {
            redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL,
        });

        if (error) throw new UnauthorizedException(error.message);

        return {
            message: 'Password reset email sent',
            data,
        };
    }

    async loginWithGoogle() {
        const { data, error }=await this.supabaseService.client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.GOOGLE_REDIRECT_URL,
            },
        });

        if (error) throw new UnauthorizedException(error.message);
        return { url: data.url }; // Redirect this from frontend
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
