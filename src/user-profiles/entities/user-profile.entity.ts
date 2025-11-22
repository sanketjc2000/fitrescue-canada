import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { AppUser } from '../../users/entities/app-user.entity';

export enum Goal {
    FAT_LOSS='Fat loss',
    LEAN_BULK='Lean bulk',
    MAINTENANCE='Maintenance',
}

@Entity('user_profiles')
export class UserProfile {
    @PrimaryColumn({ name: 'user_id', type: 'uuid' })
    userId: string;

    @OneToOne(() => AppUser)
    @JoinColumn({ name: 'user_id' })
    user: AppUser;

    @Column({ name: 'display_name', type: 'text', nullable: true })
    displayName: string;

    @Column({ type: 'text', default: 'en' })
    locale: string;

    @Column({ name: 'onboarding_completed', type: 'boolean', default: false })
    onboardingCompleted: boolean;

    @Column({ type: 'text', nullable: true }) // Using text for enum to match schema 'USER-DEFINED' or text
    goal: Goal;

    @Column({ name: 'height_cm', type: 'smallint', nullable: true })
    heightCm: number;

    @Column({ name: 'weight_kg', type: 'numeric', nullable: true })
    weightKg: number;

    @Column({ type: 'smallint', nullable: true })
    age: number;

    @Column({ type: 'text', nullable: true })
    sex: string;

    @Column({ name: 'activity_level', type: 'text', nullable: true })
    activityLevel: string;

    @Column({ name: 'budget_preference_cents', type: 'integer', nullable: true })
    budgetPreferenceCents: number;

    @Column({ name: 'allow_location', type: 'boolean', default: false })
    allowLocation: boolean;

    @Column({ name: 'home_location', type: 'jsonb', nullable: true })
    homeLocation: any;

    @Column({ name: 'last_seen_at', type: 'timestamptz', nullable: true })
    lastSeenAt: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'avatar_url', type: 'text', nullable: true })
    avatarUrl: string;
}
