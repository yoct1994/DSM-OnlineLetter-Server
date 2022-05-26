import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

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
  })
  @OneToOne(() => User)
  @JoinColumn()
  to: User;

  @OneToOne(() => User)
  @JoinColumn()
  from: User;

  @Column({
    nullable: false,
  })
  chatList: string;

  @Column({
    nullable: false,
  })
  isRead: boolean;

  @Column({
    nullable: false,
  })
  writeAt: Date;
}
