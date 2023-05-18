import { NextFunction, Request, Response } from "express";

const apiKey = process.env.API_KEY;

// Middleware function to check if API key is valid
export const apiKeyMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const apiKeyHeader = req.headers['apikey'];
  if (!apiKeyHeader || apiKeyHeader !== apiKey) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

// Apply the middleware to all routes
