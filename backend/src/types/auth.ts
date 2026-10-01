export interface IAuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
