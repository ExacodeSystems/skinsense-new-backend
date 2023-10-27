import express from "express";
import AnalyzerController from "../controllers/analyzer.controller.js";

const router = express.Router();
const controller = new AnalyzerController()

router.post("/", controller.getAnalysis);

export default router;
