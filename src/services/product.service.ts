import { RowDataPacket } from "mysql2";
import { Product } from "../@types/product.js";
import AbsService from "../abstracts/abs-service.js";
import pool from "../config/db.js";
import { ingredientsServiceInstance } from "./index.js";

class ProductService implements AbsService<Product> {
  async getAll(page = 1, number_per_page = 10, search_query: string | undefined = undefined): Promise<Product[]> {
    try {
      let queryString = "SELECT * FROM product"
      let queryParams = []

      if (search_query) {
        queryString += ' WHERE name LIKE ? OR brand_name LIKE ?';
        queryParams.push(`%${search_query}%`);
        queryParams.push(`%${search_query}%`);
      }

      queryString += " LIMIT ? OFFSET ?"
      const [rows] = await pool.query<Product[] & RowDataPacket[][]>(
        queryString,
        [...queryParams, number_per_page, page * number_per_page]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }
  async getById(id: string): Promise<Product | null> {
    try {
      const [rows] = await pool.query<Product[] & RowDataPacket[][]>(
        "SELECT * FROM product WHERE id = ?",
        [id],
      );
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  }
  async getSimilar(ingredients: string) : Promise<Product[] | null> {
    try {
      if(!ingredients || ingredients === "") throw new Error("Please provide ingredients")
      let baseQuery = "SELECT * FROM product"
      const queryParams : string[] = []

      const ingredientsSplitted = ingredients.split(",").map(x => x.trim()).filter(x => x && x !== "")
      const ingredientsData = await Promise.all(ingredientsSplitted.map(x => ingredientsServiceInstance.getByNameFromAll(x)))

      ingredientsData.map((ing, index) => {
        if(index === 0) {
          baseQuery += " WHERE ingredients LIKE ? "
        } else {
          baseQuery += " AND ingredients LIKE ? "
        }
        queryParams.push(`%${ing?.name}%`)
      })

      baseQuery += " LIMIT 10"

      const [rows] = await pool.query<Product[] & RowDataPacket[][]>(
        baseQuery,
        [...queryParams],
      );

      return rows
    } catch (error) {
      throw error;
    }
  }
  async getRecommended(ingredients: string[], category: string) : Promise<Product[] | null> {
    try {
      if(ingredients.length === 0) throw new Error("Please provide ingredients")
      let baseQuery = "SELECT * FROM product"
      const queryParams : string[] = []

      const ingredientsData = await Promise.all(ingredients.map(x => ingredientsServiceInstance.getByNameFromAll(x)))

      ingredientsData.map((ing, index) => {
        if(index === 0) {
          baseQuery += " WHERE (ingredients LIKE ?"
        } else {
          baseQuery += " OR ingredients LIKE ?"
        }
        queryParams.push(`%${ing?.name}%`)
      })
      
      baseQuery += ")"

      baseQuery += " AND category_name = ?"
      queryParams.push(category)
      baseQuery += " LIMIT 10"

      const [rows] = await pool.query<Product[] & RowDataPacket[][]>(
        baseQuery,
        [...queryParams],
      );

      return rows
    } catch (error) {
      throw error;
    }
  }
  create(data: Product): Promise<Product | null> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: Partial<Product>): Promise<Product | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default ProductService