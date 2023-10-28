import { NextFunction, Request, Response, query } from "express";
import { productServiceInstance } from "../services/index.js";

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
}

export default ProductController