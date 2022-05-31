import { EntityRepository, Repository } from 'typeorm';
import { LetterUser } from './letter-user.entity';

@EntityRepository(LetterUser)
export class LetterUserRepository extends Repository<LetterUser> {}
