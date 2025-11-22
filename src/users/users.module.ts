import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { AppUser } from './entities/app-user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AppUser])],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }
