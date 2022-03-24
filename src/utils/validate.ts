import { NextFunction, Request, Response } from 'express';
import logger from './logger';

// validate if the request is coming from correct origin
// and the Linear-Delivery exists
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = async (
 req: Request,
 res: Response,
 next: NextFunction,
) => {
 const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
 if (ip !== '35.243.134.228' && ip !== '35.231.147.226') {
  logger.error('Invalid Linear Origin');
  return res.status(400).send('Invalid Linear Origin');
 }

 if (req.query.SECRET_KEY !== process.env.WEBHOOK_SECRET_KEY) {
  logger.error('Invalid SECRET_KEY header');
  return res.status(400).send('Invalid SECRET_KEY header');
 }

 next();
 return null;
};
