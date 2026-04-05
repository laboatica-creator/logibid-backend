import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();

export class AuthService {
  async register(userData: any) {
    const { name, email, phone, password, role } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      phone,
      password_hash: hashedPassword,
      role
    });

    const token = this.generateToken(user.id);

    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'logibid_super_secret_123';
    return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
  }
}