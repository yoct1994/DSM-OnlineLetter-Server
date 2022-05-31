import { Letter } from 'src/entity/letter/letter.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('letter_image')
export class LetterImage {
  @PrimaryGeneratedColumn()
  imageSeq: number;

  @Column({
    nullable: false,
  })
  imageName: string;

  @Column({
    nullable: false,
  })
  @ManyToOne(() => Letter)
  @JoinColumn({ name: 'letter' })
  letter: Letter;
}
