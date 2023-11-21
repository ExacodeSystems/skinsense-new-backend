import { NextFunction, Request, Response } from "express";
import { productServiceInstance, reviewServiceInstance, userServiceInstance } from "../services/index.js";
import { Review } from "../@types/review.js";

class ReviewController {
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params.id;
      const review = await reviewServiceInstance.getById(reviewId)
      if (!review) throw new Error("Can't find this review")

      const user = await userServiceInstance.getById(review.user_id)
      const product = await productServiceInstance.getById(review.product_id)

      res.json({
        ...review,
        user,
        product
      })
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