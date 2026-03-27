import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/request.service';
import { emitNewRequest } from '../socket/socketManager';

const requestService = new RequestService();

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.createRequest({
      ...req.body,
      client_id: req.userId
    });
    
    // Emitir evento en tiempo real para transportistas
    emitNewRequest(request);
    
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await requestService.getAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};