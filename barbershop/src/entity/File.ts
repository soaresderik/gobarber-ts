import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  AfterLoad
} from "typeorm";
import User from "./User";

const fileurl = process.env.LETSENCRYPT_HOST
  ? `https://${process.env.LETSENCRYPT_HOST}`
  : `http://localhost:3333`;

@Entity("files")
export default class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  userId: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  url: string;

  @AfterLoad()
  getUrl() {
    this.url = `${fileurl}/files/${this.path}`;
  }
}
