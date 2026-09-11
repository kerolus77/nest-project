import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Product } from "../products/product.entity.js";
import type { Review } from "../reviews/review.entity.js";
import { CURRENT_TIMESTAMP } from "../uitils/constant.js";


enum UserType {
    ADMIN = 'admin',
    NORMAL_USER = 'normal_user'
}
@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar', length: '150', nullable: true })
    userName: string;
    @Column({ type: 'varchar', length: '150', unique: true})
    email: string;
    @Column()
    password: string;
    @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
    userType: UserType;
    @Column({default:false})
    isAccountVerified: boolean;
    
    @OneToMany('Product',(product: Product)=>product.user)
    products: Product[];
    @OneToMany('Review',(review: Review)=>review.user)
    reviews: Review[];
    @CreateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate:  CURRENT_TIMESTAMP})
    updatedAt: Date;
}