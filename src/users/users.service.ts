import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from './entities/app-user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(AppUser)
        private readonly appUserRepository: Repository<AppUser>,
    ) { }

    async create(userData: Partial<AppUser>): Promise<AppUser> {
        const newUser=this.appUserRepository.create(userData);
        return this.appUserRepository.save(newUser);
    }

    async findOneByEmail(email: string): Promise<AppUser|null> {
        return this.appUserRepository.findOne({ where: { email } });
    }

    async findOneBySupabaseId(supabaseUserId: string): Promise<AppUser|null> {
        return this.appUserRepository.findOne({ where: { supabaseUserId } });
    }
}
