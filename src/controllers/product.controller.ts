import { NextFunction, Request, Response, query } from "express";
import { ingredientsServiceInstance, productServiceInstance, reviewServiceInstance, userServiceInstance } from "../services/index.js";

class ProductController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined
      const number_per_page = req.query.number_per_page ? parseInt(req.query.number_per_page as string) : undefined
      const search_query = req.query.search as string

      const products = await productServiceInstance.getAll(page, number_per_page, search_query)
      res.json(products)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const product = await productServiceInstance.getById(productId)
      res.json(product)
    } catch (error) {
      next(error)
    }
  }

  getReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewId = req.params.id;
      const reviews = await reviewServiceInstance.getByProductId(reviewId)

      if (!reviews) throw new Error("Can't find reviews")

      const reviewsPopulated = reviews.map(async review => {
        const user = await userServiceInstance.getById(review.user_id)
        const product = await productServiceInstance.getById(review.product_id)

        return {
          ...review,
          user,
          product
        }
      })

      res.json(await Promise.all(reviewsPopulated))
    } catch (error) {
      next(error)
    }
  }

  getSimilar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingredients = req.query.ingredients as string
      const product = await productServiceInstance.getSimilar(ingredients)
      res.json(product)
    } catch (error) {
      next(error)
    }
  }
  
  getRecommended = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skinTypes, concerns, categories } = req.body

      if (!skinTypes) throw new Error("Skin types can't be null")
      if (!concerns) throw new Error("Concerns can't be null")
      if (!categories) throw new Error("Categories can't be null")

      const ingredientsGoodForConcerns = await ingredientsServiceInstance.getByGoodFor(concerns) ?? []
      const ingredientsBadForConcerns = await ingredientsServiceInstance.getByBadFor(concerns) ?? []
      const ingredientsGoodForSkinTypes = await ingredientsServiceInstance.getByGoodForSkinTypes(skinTypes) ?? []
      const ingredientsBadForSkinTypes = await ingredientsServiceInstance.getByBadForSkinTypes(skinTypes) ?? []

      const ingredientsIntersection = ingredientsGoodForConcerns.filter(n => ingredientsGoodForSkinTypes.some(n2 => n2.id === n.id))
      const ingredientsWithoutUserBadForConcerns = ingredientsIntersection.filter(n => !ingredientsBadForConcerns.some(n2 => n2.id === n.id))
      const ingredientsWithoutUserBadForSkinTypes = ingredientsWithoutUserBadForConcerns.filter(n => !ingredientsBadForSkinTypes.some(n2 => n2.id === n.id))
      
      const ingredientsIntersectionNames = ingredientsWithoutUserBadForSkinTypes.map(x => x.name)
      
      const products = await productServiceInstance.getRecommended(ingredientsIntersectionNames, categories)

      res.json(products)
    } catch (error) {
      next(error)
    }
  }
}

export default ProductController