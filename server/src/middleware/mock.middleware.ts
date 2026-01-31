import { Response, NextFunction } from "express";

export const mockAuth = (req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: "6978bfac5ba09e71d7453352"
  };
  next();
};
