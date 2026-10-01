export type Role = 'student' | 'coach' | 'admin';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}
