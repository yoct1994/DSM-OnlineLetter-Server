import { compareSync, hashSync } from "bcrypt";


export const hash = (password: string): string => {
    const roundSalt = 10;
    return hashSync(password, roundSalt);
};

export const compare = (password: string, hashPassword: string): boolean => {
    return compareSync(password, hashPassword);
}