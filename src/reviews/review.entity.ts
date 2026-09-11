import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Product } from "../products/product.entity.js";
import { CURRENT_TIMESTAMP } from "../uitils/constant.js";
import type { UserEntity } from "../users/user.entity.js";

@Entity('reviews')
export class Review {
@PrimaryGeneratedColumn()
id: number;
@Column({length: 500})
comment: string;
@Column({type: 'int'})
rating: number;
@CreateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP})
createdAt: Date;
@UpdateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate:  CURRENT_TIMESTAMP})
updatedAt: Date;
@ManyToOne('Product', (product: Product) => product.reviews)
product: Product;
@ManyToOne('UserEntity', (user: UserEntity) => user.reviews)
user: UserEntity;

}