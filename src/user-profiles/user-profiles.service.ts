import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';

@Injectable()
export class UserProfilesService {
    constructor(
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
    ) { }

    async createOrUpdate(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
        let profile=await this.userProfileRepository.findOne({ where: { userId } });

        if (!profile) {
            profile=this.userProfileRepository.create({ ...profileData, userId });
        } else {
            Object.assign(profile, profileData);
        }

        return this.userProfileRepository.save(profile);
    }

    async findOne(userId: string): Promise<UserProfile> {
        const profile=await this.userProfileRepository.findOne({ where: { userId } });
        if (!profile) {
            throw new NotFoundException(`User profile not found for user ${userId}`);
        }
        return profile;
    }
}
