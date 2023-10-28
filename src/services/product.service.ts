import { RowDataPacket } from "mysql2";
import { Product } from "../@types/product.js";
import AbsService from "../abstracts/abs-service.js";
import pool from "../config/db.js";

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