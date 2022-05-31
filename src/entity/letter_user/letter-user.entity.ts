import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Letter } from '../letter/letter.entity';
import { User } from '../user/user.entity';

@Entity('letterUser')
export class LetterUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.userSeq)
  @JoinColumn({ name: 'userSeq' })
  userSeq: User;

  @ManyToOne((type) => Letter, (letters) => letters.id)
  @JoinColumn({ name: 'letterId' })
  letterId: Letter;

  @Column({
    nullable: false,
  })
  fromOrTo: string;
}
