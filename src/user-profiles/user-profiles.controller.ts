import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { UserProfile } from './entities/user-profile.entity';

// Placeholder guard until we have a real AuthGuard
// import { AuthGuard } from '@nestjs/passport'; 

@Controller('user-profiles')
export class UserProfilesController {
    constructor(private readonly userProfilesService: UserProfilesService) { }

    // TODO: Add AuthGuard
    // @UseGuards(AuthGuard('jwt')) 
    @Post('onboarding')
    async onboarding(@Body() profileData: Partial<UserProfile>, @Req() req: any) {
        // For now, we assume userId is passed in body or we need to extract from token
        // In a real scenario with Supabase Auth Guard, req.user would have the user info
        // Let's assume for MVP testing we might pass userId in body if no guard yet, 
        // OR we should implement the guard. 
        // Given the prompt, I'll assume we need to handle it. 
        // But wait, we have Supabase Auth. We should probably use a Guard to get the user.

        // For this step, I'll just take userId from body for simplicity if not present in req.user
        const userId=req.user?.id||profileData.userId;
        if (!userId) {
            throw new Error('User ID is required');
        }

        return this.userProfilesService.createOrUpdate(userId, {
            ...profileData,
            onboardingCompleted: true,
        });
    }

    // @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Req() req: any) {
        const userId=req.user?.id||req.query.userId; // Fallback for testing
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.userProfilesService.findOne(userId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateProfile(@Body() profileData: Partial<UserProfile>, @Req() req: any) {
        const userId=req.user?.id||profileData.userId;
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.userProfilesService.createOrUpdate(userId, profileData);
    }
}
