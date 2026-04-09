import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'logibid_super_secret_123';
const userRepository = new UserRepository();

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new Error('You are not logged in. Please log in to get access.');
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new Error('The user belonging to this token no longer exists.');
    }

    (req as any).userId = user.id;
    (req as any).userRole = user.role;
    (req as any).user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ status: 'fail', message: error.message });
  }
};

export const socketAuth = async (socket: any, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findById(decoded.id);
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user.id;
    socket.userRole = user.role;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};