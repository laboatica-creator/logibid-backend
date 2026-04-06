import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.login(req.body.email, req.body.password);
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserById((req as any).userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};