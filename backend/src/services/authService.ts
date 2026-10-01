import { User, IUserDocument } from '../models/User.js';
import { memoryStore } from '../stores/MemoryStore.js';
import { signToken } from '../config/jwt.js';
import { IAuthUser } from '../types/auth.js';
import { isMongoDBReady } from '../stores/MemoryStore.js';

const useMemory = !isMongoDBReady();

export const findUserByEmail = async (email: string): Promise<IUserDocument | null> => {
  if (useMemory) {
    const memUser = await memoryStore.findOne({ email });
    if (!memUser) return null;
    return {
      ...memUser,
      comparePassword: async (candidate: string) => memoryStore.comparePassword(memUser, candidate),
      isModified: () => false,
      save: async () => memUser,
    } as unknown as IUserDocument;
  }
  return User.findOne({ email });
};

export const createUser = async (data: { firstName: string; lastName: string; email: string; password: string }): Promise<IUserDocument> => {
  if (useMemory) {
    const memUser = await memoryStore.create(data);
    return {
      ...memUser,
      comparePassword: async (candidate: string) => memoryStore.comparePassword(memUser, candidate),
      isModified: () => false,
      save: async () => memUser,
    } as unknown as IUserDocument;
  }
  return User.create(data);
};

export const generateAuthToken = (user: { role: string; _id: string | { toString(): string } }): string => {
  const userId = typeof user._id === 'string' ? user._id : user._id.toString();
  return signToken({ userId, role: user.role });
};

export const toAuthResponse = (user: { _id: string | { toString(): string }; firstName: string; lastName: string; email: string; role: string }): IAuthUser => ({
  _id: typeof user._id === 'string' ? user._id : user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
});

export const toProfileResponse = (user: { _id: string | { toString(): string }; firstName: string; lastName: string; email: string; role: string; phone?: string; belt?: string; level?: string; joinDate?: string; academy?: string; coach?: string; avatarUrl?: string; createdAt?: Date }): IAuthUser & { phone?: string; belt?: string; level?: string; joinDate?: string; academy?: string; coach?: string; avatarUrl?: string; createdAt?: Date } => ({
  _id: typeof user._id === 'string' ? user._id : user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  belt: user.belt,
  level: user.level,
  joinDate: user.joinDate,
  academy: user.academy,
  coach: user.coach,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});

const profileUpdateFields = ['firstName', 'lastName', 'phone', 'belt', 'level', 'academy', 'coach'] as const;

export const updateUserProfile = async (userId: string, updates: Record<string, any>): Promise<IUserDocument | null> => {
  // Filter to allowed fields only — never allow role/password changes
  const safeUpdates: Record<string, any> = {};
  for (const key of profileUpdateFields) {
    if (updates[key] !== undefined) safeUpdates[key] = updates[key];
  }

  if (useMemory) {
    const memUser = memoryStore.updateProfile(userId, safeUpdates);
    return memUser as unknown as IUserDocument;
  }

  // MongoDB mode
  const user = await User.findById(userId);
  if (!user) return null;
  Object.assign(user, safeUpdates);
  await user.save();
  return user;
};
