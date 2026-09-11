import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

const CURRENT_TIMESTAMP='CURRENT_TIMESTAMP(6)'
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
    @CreateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate:  CURRENT_TIMESTAMP})
    updatedAt: Date;
}