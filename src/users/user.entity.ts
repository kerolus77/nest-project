import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Product } from "../products/product.entity.js";
import type { Review } from "../reviews/review.entity.js";
import { CURRENT_TIMESTAMP } from "../uitils/constant.js";
import { UserType } from "../uitils/enums.js";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar', length: '150', nullable: true })
    userName: string;
    @Column({ type: 'varchar', length: '150', unique: true})
    email: string;
    @Column()
    @Exclude()
    password: string;
    @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
    userType: UserType;
    @Column({ type: 'varchar', length: 255, nullable: true })
    imageUrl: string | null;
    @Column({default:false})
    isAccountVerified: boolean;
    @Column({ type: 'varchar', nullable: true })
    verificationToken: string|null;
    @Column({ type: 'timestamp', nullable: true })
    verificationTokenExpiry: Date|null ;
    @Column({ type: 'varchar', nullable: true })
    resetPasswordToken: string|null;
    @Column({ type: 'timestamp', nullable: true })
    resetPasswordTokenExpiry: Date|null ;
    @OneToMany('Product',(product: Product)=>product.user)
    products: Product[];
    @OneToMany('Review',(review: Review)=>review.user)
    reviews: Review[];
    @CreateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate:  CURRENT_TIMESTAMP})
    updatedAt: Date;
}