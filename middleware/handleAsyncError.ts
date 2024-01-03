import { Request, Response, NextFunction } from 'express';

const handleAsyncError: Function = (passedFunction: Function) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await passedFunction(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default handleAsyncError;
