import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

// Retener pago
export const holdPayment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const clientId = req.userId;
    const payment = await paymentService.holdPayment(clientId, req.body);
    res.status(201).json({
      status: 'success',
      data: { payment }
    });
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Liberar pago
export const releasePayment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { paymentId } = req.body;
    const payment = await paymentService.releasePayment(userId, paymentId);
    res.status(200).json({
      status: 'success',
      message: 'Pago liberado al transportista',
      data: { payment }
    });
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Reembolsar pago
export const refundPayment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { paymentId } = req.body;
    const payment = await paymentService.refundPayment(userId, paymentId);
    res.status(200).json({
      status: 'success',
      message: 'Pago reembolsado al cliente',
      data: { payment }
    });
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Obtener pagos por solicitud
export const getPaymentsByRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.getPaymentsByRequest(req.params.requestId);
    res.status(200).json({
      status: 'success',
      data: { payments }
    });
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Obtener pagos del usuario
export const getUserPayments = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const payments = await paymentService.getUserPayments(userId);
    res.status(200).json({
      status: 'success',
      data: { payments }
    });
  } catch (error: any) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
