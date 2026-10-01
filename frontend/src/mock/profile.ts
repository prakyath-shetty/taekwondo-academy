import type { IUser } from '../types';

/**
 * Mock profile data for Phase 2.
 * Replaced by real API data when profile endpoints are fully integrated.
 */
export const mockUserProfile: IUser = {
  _id: 'dev-1',
  firstName: 'Min-jun',
  lastName: 'Kim',
  email: 'minjun@student.academy.ko',
  role: 'student',
  phone: '+82 10-1234-5678',
  belt: 'Blue Belt (2nd Kup)',
  level: 'Intermediate',
  joinDate: '2024-03-15',
  academy: 'Seoul Central Dojang',
  coach: 'Coach Park',
  avatarUrl: '',
};

/** Valid belt levels for select dropdown */
export const BELT_OPTIONS = [
  'White Belt',
  'White-Green Belt',
  'Green Belt',
  'Green-Blue Belt',
  'Blue Belt (4th Kup)',
  'Blue-Tiger Belt',
  'Tiger Belt (3rd Kup)',
  'Tiger-Red Belt',
  'Red Belt (2nd Kup)',
  'Red-Black Belt',
  'Black Belt (1st Dan)',
];

/** Training levels */
export const LEVEL_OPTIONS = [
  'Beginner',
  'Elementary',
  'Intermediate',
  'Advanced',
  'Elite',
];
