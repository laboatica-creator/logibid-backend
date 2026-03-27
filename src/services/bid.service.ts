import { BidRepository } from '../repositories/bid.repository';

const bidRepository = new BidRepository();

export class BidService {
  async createBid(data: any) {
    const { request_id, driver_id, amount, message } = data;
    
    if (!request_id || !driver_id || !amount) {
      throw new Error('Request ID, driver ID and amount are required');
    }
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    return await bidRepository.create(data);
  }

  async getBidsByRequest(request_id: string) {
    return await bidRepository.findByRequestId(request_id);
  }

  async getBidById(id: string) {
    const bid = await bidRepository.findById(id);
    if (!bid) {
      throw new Error('Bid not found');
    }
    return bid;
  }

  async acceptBid(bidId: string, userId: string, userRole: string) {
    const bid = await bidRepository.findById(bidId);
    if (!bid) {
      throw new Error('Bid not found');
    }
    
    if (userRole !== 'client') {
      throw new Error('Only clients can accept bids');
    }
    
    const request = await bidRepository.findRequestByClient(bid.request_id, userId);
    if (!request) {
      throw new Error('You are not the owner of this request');
    }
    
    if (bid.status !== 'pending') {
      throw new Error('This bid is no longer available');
    }
    
    await bidRepository.updateStatus(bidId, 'accepted');
    await bidRepository.rejectOtherBids(bid.request_id, bidId);
    await bidRepository.updateRequestStatus(bid.request_id, 'assigned');
    
    const updatedBid = await bidRepository.findById(bidId);
    const updatedRequest = await bidRepository.getRequestById(bid.request_id);
    
    return { bid: updatedBid, request: updatedRequest };
  }
  
  async findRequestByClient(requestId: string, clientId: string) {
    const result = await bidRepository.findRequestByClient(requestId, clientId);
    return result;
  }

  async getRequestById(requestId: string) {
    const result = await bidRepository.getRequestById(requestId);
    if (!result) {
      throw new Error('Request not found');
    }
    return result;
  }
}