import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("content_security_track")
export class ContentSecurity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  msisdn!: string;

  @Column()
  service_id!: string;

  @Column()
  ctx!: string;

  @Column()
  ext_ref!: string;

  @Column()
  transaction_id!: string;

  @Column()
  source!: string;

  @Column()
  mno!: string;

  @CreateDateColumn({ type: "datetime" })
  created_at!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at!: Date;
}
