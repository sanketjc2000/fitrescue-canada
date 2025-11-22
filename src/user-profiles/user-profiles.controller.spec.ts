import { Test, TestingModule } from '@nestjs/testing';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';

const mockUserProfilesService=() => ({
    createOrUpdate: jest.fn(),
    findOne: jest.fn(),
});

describe('UserProfilesController', () => {
    let controller: UserProfilesController;
    let service: ReturnType<typeof mockUserProfilesService>;

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            controllers: [UserProfilesController],
            providers: [
                {
                    provide: UserProfilesService,
                    useFactory: mockUserProfilesService,
                },
            ],
        }).compile();

        controller=module.get<UserProfilesController>(UserProfilesController);
        service=module.get(UserProfilesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('onboarding', () => {
        it('should call createOrUpdate with onboardingCompleted: true', async () => {
            const userId='user-123';
            const profileData={ displayName: 'Test User' };
            const req={ user: { id: userId } };
            service.createOrUpdate.mockResolvedValue({ ...profileData, userId, onboardingCompleted: true });

            await controller.onboarding(profileData, req);
            expect(service.createOrUpdate).toHaveBeenCalledWith(userId, { ...profileData, onboardingCompleted: true });
        });
    });

    describe('getProfile', () => {
        it('should call findOne with userId', async () => {
            const userId='user-123';
            const req={ user: { id: userId } };
            service.findOne.mockResolvedValue({ userId });

            await controller.getProfile(req);
            expect(service.findOne).toHaveBeenCalledWith(userId);
        });
    });

    describe('updateProfile', () => {
        it('should call createOrUpdate with userId and data', async () => {
            const userId='user-123';
            const profileData={ displayName: 'Updated' };
            const req={ user: { id: userId } };
            service.createOrUpdate.mockResolvedValue({ userId, ...profileData });

            await controller.updateProfile(profileData, req);
            expect(service.createOrUpdate).toHaveBeenCalledWith(userId, profileData);
        });
    });
});
