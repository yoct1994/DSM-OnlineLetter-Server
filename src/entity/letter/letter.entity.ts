import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LetterUser } from '../letter_user/letter-user.entity';

@Entity('letter')
export class Letter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
    length: 1000,
  })
  chatList: string;

  @OneToMany((type) => LetterUser, (users) => users.letterId, { cascade: true })
  @JoinTable({ name: 'letterUsers' })
  letterUsers: LetterUser[];

  @Column({
    nullable: false,
  })
  isRead: boolean;

  @Column({
    nullable: false,
  })
  writeAt: number;
}
