import { EntityRepository, Repository } from 'typeorm';
import { Letter } from './letter.entity';

@EntityRepository(Letter)
export class LetterRepository extends Repository<Letter> {}
