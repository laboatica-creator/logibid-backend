import { RequestRepository } from '../repositories/request.repository.js';

const requestRepository = new RequestRepository();

export class RequestService {
  async createRequest(data: any) {
    if (!data.pickup_address || !data.delivery_address) {
      throw new Error('Pickup and delivery addresses are required');
    }
    return await requestRepository.create(data);
  }

  async getAllRequests() {
    return await requestRepository.findAll();
  }

  async getRequestById(id: string) {
    return await requestRepository.findById(id);
  }
}