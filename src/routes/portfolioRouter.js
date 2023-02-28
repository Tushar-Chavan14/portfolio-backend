import { Router } from "express";
import { portfolioModel } from "../db/models/portfolioModal.js";
import { auth } from "../middleware/auth.js";

export const portfolioRouter = Router();
