import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name?: string;
  email: string;
  passwordHash: string;
  totpSecret?: string;
}

export const users: User[] = [];

// Test user
const testUser: User = {
  id: '1',
  email: 'test@example.com',
  passwordHash: bcrypt.hashSync('password123', 10),
  totpSecret: 'JBSWY3DPEHPK3PXP', // example TOTP secret
};
users.push(testUser);

export const createUser = (email: string, password: string, name?: string) => {
  const passwordHash = bcrypt.hashSync(password, 10);
  const user: User = { id: Date.now().toString(), email, passwordHash, name };
  users.push(user);
  return user;
};

export const findUserByEmail = (email: string) =>
  users.find(u => u.email === email);

export const findUserById = (id: string) =>
  users.find(u => u.id === id);
