import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('app_users')
export class AppUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'auth_id', type: 'uuid', unique: true, nullable: true })
    authId: string;

    @Column({ type: 'text', unique: true, nullable: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    phone: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'supabase_user_id', type: 'uuid', unique: true, nullable: true })
    supabaseUserId: string;
}
