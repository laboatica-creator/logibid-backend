import { Request, Response, NextFunction } from 'express';
import { BidService } from '../services/bid.service';
import { emitNewBid, emitBidAccepted } from '../socket/socketManager';

const bidService = new BidService();

export const createBid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bid = await bidService.createBid({
      ...req.body,
      driver_id: req.userId
    });
    
    // Obtener información de la solicitud para emitir evento
    const request = await bidService.getRequestById(bid.request_id);
    
    // Emitir evento en tiempo real al cliente
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
      req.userId,
      req.userRole
    );
    
    // Emitir evento en tiempo real al transportista ganador
    emitBidAccepted(result.bid, result.request, result.bid.driver_id);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};