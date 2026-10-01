import api from './api';
import { IAuthResponse } from '../types';

export const signup = (data: { firstName: string; lastName: string; email: string; password: string }) =>
  api.post<IAuthResponse>('/auth/signup', data);

export const login = (data: { email: string; password: string }) =>
  api.post<IAuthResponse>('/auth/login', data);

export const logout = () =>
  api.post<IAuthResponse>('/auth/logout');

export const getMe = () =>
  api.get<IAuthResponse>('/auth/me');

export const forgotPassword = (data: { email: string }) =>
  api.post<IAuthResponse>('/auth/forgot-password', data);

export const resetPassword = (data: { token: string; password: string }) =>
  api.post<IAuthResponse>('/auth/reset-password', data);
