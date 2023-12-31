import { NextFunction, Request, Response } from "express";
import { AnalysisRequest } from "../@types/analysis-request.js";
import { analyzerServiceInstance } from "../services/index.js";

class AnalyzerController {
  getAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestData : AnalysisRequest = req.body

      if(!requestData.concerns) throw new Error("Concerns cant be null")
      if(!requestData.skinTypes) throw new Error("Skin types cant be null")
      if(!requestData.productId && !requestData.ingredients) throw new Error("Product ID or ingredients can't be null")

      const analysisResult = await analyzerServiceInstance.getAnalysis(requestData)
      res.json(analysisResult)
    } catch (error) {
      next(error)
    }
  }
}

export default AnalyzerController