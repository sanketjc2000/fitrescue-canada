import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProfilesService } from './user-profiles.service';
import { UserProfile } from './entities/user-profile.entity';

const mockUserProfileRepository=() => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

describe('UserProfilesService', () => {
    let service: UserProfilesService;
    let repository: ReturnType<typeof mockUserProfileRepository>;

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            providers: [
                UserProfilesService,
                {
                    provide: getRepositoryToken(UserProfile),
                    useFactory: mockUserProfileRepository,
                },
            ],
        }).compile();

        service=module.get<UserProfilesService>(UserProfilesService);
        repository=module.get(getRepositoryToken(UserProfile));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createOrUpdate', () => {
        it('should create a new profile if one does not exist', async () => {
            const userId='user-123';
            const profileData={ displayName: 'Test User' };
            repository.findOne.mockResolvedValue(null);
            repository.create.mockReturnValue({ userId, ...profileData });
            repository.save.mockResolvedValue({ userId, ...profileData });

            const result=await service.createOrUpdate(userId, profileData);
            expect(repository.create).toHaveBeenCalledWith({ userId, ...profileData });
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual({ userId, ...profileData });
        });

        it('should update an existing profile', async () => {
            const userId='user-123';
            const profileData={ displayName: 'Updated Name' };
            const existingProfile={ userId, displayName: 'Old Name' };
            repository.findOne.mockResolvedValue(existingProfile);
            repository.save.mockResolvedValue({ ...existingProfile, ...profileData });

            const result=await service.createOrUpdate(userId, profileData);
            expect(repository.create).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith({ ...existingProfile, ...profileData });
            expect(result.displayName).toEqual('Updated Name');
        });
    });

    describe('findOne', () => {
        it('should return a profile if found', async () => {
            const userId='user-123';
            const profile={ userId, displayName: 'Test User' };
            repository.findOne.mockResolvedValue(profile);

            const result=await service.findOne(userId);
            expect(result).toEqual(profile);
        });

        it('should throw NotFoundException if not found', async () => {
            const userId='user-123';
            repository.findOne.mockResolvedValue(null);

            await expect(service.findOne(userId)).rejects.toThrow();
        });
    });
});
