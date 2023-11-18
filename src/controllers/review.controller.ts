import { NextFunction, Request, Response } from "express";
import { reviewServiceInstance } from "../services/index.js";
import { Review } from "../@types/review.js";

class ReviewController {
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params.id;
      const review = await reviewServiceInstance.getById(reviewId)
      res.json(review)
    } catch (error) {
      next(error)
    }
  }

  getByProductId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params.id;
      const review = await reviewServiceInstance.getById(reviewId)
      res.json(review)
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review : Review = req.body;
      const createdReview = await reviewServiceInstance.create(review);
      res.json(createdReview);
    } catch (error) {
      next(error)
    }
  }
}

export default ReviewController