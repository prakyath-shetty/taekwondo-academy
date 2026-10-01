import jwt, { SignOptions } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;
const EXPIRE = (process.env.JWT_EXPIRE || '7d') as SignOptions['expiresIn'];

export const signToken = (payload: object): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRE });
};

export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return 'Invalid token';
  }
};
