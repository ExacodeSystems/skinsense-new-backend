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

  addLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params.id;
      const review = await reviewServiceInstance.addLike(reviewId)
      if (!review) throw new Error("Can't find this review")

      const user = await userServiceInstance.getById(review.user_id)
      const product = await productServiceInstance.getById(review.product_id)

      const data = {
        ...review,
        user,
        product
      }

      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review : Review = req.body;
      const createdReview = await reviewServiceInstance.create(review);
      if (!createdReview) throw new Error("Can't create review")

      const user = await userServiceInstance.getById(review.user_id)
      const product = await productServiceInstance.getById(review.product_id)

      const data = {
        ...createdReview,
        user,
        product
      }

      console.log(
        data
      );
      

      res.json(data);
    } catch (error) {
      next(error)
    }
  }
}

export default ReviewController