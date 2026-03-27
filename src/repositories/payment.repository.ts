import { PaymentRepository, Payment } from '../repositories/payment.repository';
import { RequestRepository } from '../repositories/request.repository';
import { getSocketManager } from '../socket/socketManager';

const paymentRepository = new PaymentRepository();
const requestRepository = new RequestRepository();

export class PaymentService {
  // Retener el pago (Hold)
  async holdPayment(clientId: string, data: { requestId: string, driverId: string, amount: number, method: string }): Promise<Payment> {
    const { requestId, driverId, amount, method } = data;

    // Simulación de transacción externa
    const transactionId = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await paymentRepository.create({
      request_id: requestId,
      client_id: clientId,
      driver_id: driverId,
      amount,
      status: 'held',
      payment_method: method,
      transaction_id: transactionId
    });

    // Notificar al transportista que el pago ha sido retenido
    try {
      const socketManager = getSocketManager();
      socketManager.emitPaymentHeld(driverId, payment);
    } catch (err) {
      console.error('Error al emitir evento de socket payment-held:', err);
    }

    return payment;
  }

  // Liberar el pago (Release)
  async releasePayment(userId: string, paymentId: string): Promise<Payment> {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    // Solo el cliente puede liberar el pago (o el sistema tras confirmación)
    // En este flujo simplificado, validamos que el usuario sea el cliente del pago
    if (payment.client_id !== userId) {
      throw new Error('No tienes autorización para liberar este pago');
    }

    if (payment.status !== 'held') {
      throw new Error('El pago no está en estado retenido');
    }

    const updatedPayment = await paymentRepository.updateStatus(paymentId, 'released', true);

    // Notificar al transportista que el pago ha sido liberado
    try {
      const socketManager = getSocketManager();
      socketManager.emitPaymentReleased(payment.driver_id, updatedPayment);
    } catch (err) {
      console.error('Error al emitir evento de socket payment-released:', err);
    }

    return updatedPayment;
  }

  // Reembolsar el pago (Refund)
  async refundPayment(userId: string, paymentId: string): Promise<Payment> {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    // Solo el cliente o un admin puede solicitar reembolso
    if (payment.client_id !== userId) {
      throw new Error('No tienes autorización para solicitar reembolso');
    }

    if (payment.status !== 'held') {
      throw new Error('Solo se pueden reembolsar pagos retenidos');
    }

    return await paymentRepository.updateStatus(paymentId, 'refunded');
  }

  // Obtener historial por solicitud
  async getPaymentsByRequest(requestId: string): Promise<Payment[]> {
    return await paymentRepository.findByRequestId(requestId);
  }

  // Obtener pagos del usuario
  async getUserPayments(userId: string): Promise<Payment[]> {
    return await paymentRepository.findByUserId(userId);
  }
}
