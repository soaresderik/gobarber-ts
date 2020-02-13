import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert,
  OneToOne,
  OneToMany
} from "typeorm";
import * as bcrypt from "bcrypt";
import { type } from "os";
import File from "./File";
import Appointment from "./Appointment";

@Entity("users")
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: "bool", nullable: false, default: false })
  provider: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToOne(
    () => File,
    file => file.user
  )
  avatar: File;

  @OneToMany(
    () => Appointment,
    appointment => appointment.user
  )
  appointments: Appointment[];

  @OneToMany(
    () => Appointment,
    appointment => appointment.user
  )
  providers: Appointment[];

  @BeforeInsert()
  private async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async updatePassword(password: string) {
    const hash = await bcrypt.hash(password, 8);

    return hash;
  }
}
