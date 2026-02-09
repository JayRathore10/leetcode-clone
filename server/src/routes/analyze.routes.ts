import { Router } from "express";
import { analyzeCode } from "../controllers/analyze.controller";

export const  analyzeRouter = Router();

analyzeRouter.post("/" , analyzeCode);
