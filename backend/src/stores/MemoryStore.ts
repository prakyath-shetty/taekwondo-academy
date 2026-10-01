import bcrypt from 'bcryptjs';

interface MemoryUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'coach' | 'admin';
  phone?: string;
  belt?: string;
  level?: string;
  joinDate?: string;
  academy?: string;
  coach?: string;
  avatarUrl?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  createdAt: Date;
  updatedAt: Date;
}

const users = new Map<string, MemoryUser>();
let _idCounter = 1;

const generateId = (): string => {
  return `dev-${String(_idCounter++)}`;
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const memoryStore = {
  async findOne(filter: { email?: string }): Promise<MemoryUser | null> {
    if (filter.email) {
      const found = Array.from(users.values()).find(u => u.email === filter.email);
      return found || null;
    }
    return null;
  },

  async create(data: { firstName: string; lastName: string; email: string; password: string; role?: string }): Promise<MemoryUser> {
    const id = generateId();
    const now = new Date();
    const hashedPassword = await hashPassword(data.password);
    const user: MemoryUser = {
      _id: id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: (data.role as MemoryUser['role']) || 'student',
      createdAt: now,
      updatedAt: now,
    };
    users.set(id, user);
    return user;
  },

  async findById(id: string): Promise<MemoryUser | null> {
    return users.get(id) || null;
  },

  async comparePassword(user: MemoryUser, candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, user.password);
  },

  /** Update user fields (used by forgot password flow) */
  async updateOne(filter: { email: string }, updates: Partial<MemoryUser>): Promise<MemoryUser | null> {
    for (const [_id, user] of users) {
      if (user.email === filter.email) {
        Object.assign(user, updates, { updatedAt: new Date() });
        return user;
      }
    }
    return null;
  },

  /** Find user by reset token */
  async findByResetToken(hashedToken: string): Promise<MemoryUser | null> {
    for (const user of users.values()) {
      // Tokens are stored as plain SHA-256 hashes — direct comparison
      if (user.resetPasswordToken === hashedToken && user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
        return user;
      }
    }
    return null;
  },

  /** Update password and clear reset token */
  async updatePassword(_id: string, newPasswordHash: string): Promise<MemoryUser | null> {
    const user = users.get(_id);
    if (!user) return null;
    user.password = newPasswordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.updatedAt = new Date();
    return user;
  },

  /** Update profile fields */
  async updateProfile(_id: string, updates: Partial<Pick<MemoryUser, 'firstName' | 'lastName' | 'phone' | 'belt' | 'level' | 'academy' | 'coach'>>): Promise<MemoryUser | null> {
    const user = users.get(_id);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date() });
    return user;
  },
};

/**
 * Returns true when a real MongoDB connection is available.
 * A connection is considered real when the URI points to a reachable
 * host (not localhost/127.0.0.1) AND does not contain placeholder text.
 */
export const isMongoDBReady = (): boolean => {
  const uri = process.env.MONGODB_URI || '';
  if (!uri) return false;
  // Reject placeholder / example URIs
  if (uri.includes('your-username') || uri.includes('your-password') || uri.includes('localhost') || uri.includes('127.0.0.1')) {
    return false;
  }
  return uri.includes('mongodb');
};
