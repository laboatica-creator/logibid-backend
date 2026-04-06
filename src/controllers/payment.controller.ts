import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service.js';

const paymentService = new PaymentService();

export const holdPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.holdPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

export const releasePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.releasePayment(req.body.paymentId, (req as any).userId);
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.refundPayment(req.body.paymentId, (req as any).userId);
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

export const getPaymentsByRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.getPaymentsByRequest(req.params.requestId);
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

export const getPaymentsByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.getPaymentsByUser((req as any).userId);
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};