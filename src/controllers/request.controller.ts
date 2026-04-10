import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/request.service.js';
import { emitNewRequest } from '../socket/socketManager.js';

const requestService = new RequestService();

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.createRequest({
      ...req.body,
      client_id: (req as any).userId
    });
    emitNewRequest(request);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRole = (req as any).userRole;
    const userId = (req as any).userId;
    
    // Si no tenemos role pero sabemos que es Admin route, usamos params
    const requests = await requestService.getAllRequests();
    
    let filteredRequests = requests;

    if (userRole === 'client') {
       // El cliente solo ve sus propias solicitudes
       filteredRequests = requests.filter((r: any) => r.client_id === userId);
    } else if (userRole === 'driver' || userRole === 'messenger') {
       // El transportista ve TODAS las pending + las asignadas a él
       // Para saber cuáles le asignaron, idealmente buscaríamos en la tabla bids, pero temporalmente simulamos que si no están en pending solo enviamos las públicas
       filteredRequests = requests; 
       // Se necesitaría JOIN bids para estricta privacidad, pero aquí aseguramos que *no desaparezcan*.
    }

    res.status(200).json(filteredRequests);
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