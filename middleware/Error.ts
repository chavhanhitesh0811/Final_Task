import { Request, Response , NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler';

const ErrorMiddleware = (err : ErrorHandler, req : Request, res : Response, next : NextFunction) : void=>{
    err.statusCode = err.statusCode || 400;
    err.message = err.message || "Bad Request";
    
    res.status(err.statusCode).json({
        message : err.message
    })
};

export default ErrorMiddleware;