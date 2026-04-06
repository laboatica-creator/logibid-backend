import { Request, Response, NextFunction } from 'express';
import { BidService } from '../services/bid.service.js';
import { emitNewBid, emitBidAccepted } from '../socket/socketManager.js';

const bidService = new BidService();

export const createBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bid = await bidService.createBid({
      ...req.body,
      driver_id: (req as any).userId
    });
    
    const request = await bidService.getRequestById(bid.request_id);
    emitNewBid(bid, bid.request_id, request.client_id);
    
    res.status(201).json(bid);
  } catch (error) {
    next(error);
  }
};

export const getBidsByRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bids = await bidService.getBidsByRequest(req.params.requestId);
    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};

export const getBidById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bid = await bidService.getBidById(req.params.id);
    res.status(200).json(bid);
  } catch (error) {
    next(error);
  }
};

export const acceptBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bidService.acceptBid(
      req.params.id,
      (req as any).userId,
      (req as any).userRole
    );
    
    emitBidAccepted(result.bid, result.request, result.bid.driver_id);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};