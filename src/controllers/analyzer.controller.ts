import { NextFunction, Request, Response } from "express";
import { AnalysisRequest } from "../@types/analysis-request.js";
import { analyzerServiceInstance } from "../services/index.js";

class AnalyzerController {
  getAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestData : AnalysisRequest = req.body
      const analysisResult = await analyzerServiceInstance.getAnalysis(requestData)
      res.json(analysisResult)
    } catch (error) {
      next(error)
    }
  }
}

export default AnalyzerController