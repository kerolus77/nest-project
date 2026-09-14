import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Review } from "../reviews/review.entity.js";
import { CURRENT_TIMESTAMP } from "../uitils/constant.js";
import type { UserEntity } from "../users/user.entity.js";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 150})
    name: string;
    @Column()
    price: number;
    @Column()
    description: string;
    @Column({ type: 'text', array: true, default: '{}' })
    imageUrls: string[];
    @CreateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate:  CURRENT_TIMESTAMP})
    updatedAt: Date;
    @OneToMany('Review', (review: Review) => review.product,{eager:true})
    reviews: Review[];
    @ManyToOne('UserEntity', (user: UserEntity) => user.products,{eager:true})
    user: UserEntity;
}