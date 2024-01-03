"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 400;
    err.message = err.message || "Bad Request";
    res.status(err.statusCode).json({
        message: err.message
    });
};
exports.default = ErrorMiddleware;
