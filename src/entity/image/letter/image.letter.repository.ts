import { EntityRepository, Repository } from 'typeorm';
import { LetterImage } from './image.letter.entity';

@EntityRepository(LetterImage)
export class LetterImageRepository extends Repository<LetterImage> {}
