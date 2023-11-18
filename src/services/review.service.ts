import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Review } from "../@types/review.js";
import AbsService from "../abstracts/abs-service.js";
import pool from "../config/db.js";
import { v1 } from "uuid";

class ReviewService implements AbsService<Review> {
  getAll(): Promise<Review[]> {
    throw new Error("Method not implemented.");
  }
  async getById(id: string): Promise<Review | null> {
    try {
      const [rows] = await pool.query<Review[] & RowDataPacket[][]>(
        "SELECT * FROM review WHERE id = ?",
        [id],
      );
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  }
  async getByProductId(product_id: string): Promise<Review | null> {
    try {
      const [rows] = await pool.query<Review[] & RowDataPacket[][]>(
        "SELECT * FROM review WHERE product_id = ?",
        [product_id],
      );
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  }
  async create(data: Review): Promise<Review | null> {
    try {
      const [rows] = await pool.query<ResultSetHeader>(
        "INSERT INTO review (id, rating, comment, user_id, product_id) VALUES (?, ?, ?, ?, ?)",
        [
          v1(),
          data.rating,
          data.comment,
          data.user_id,
          data.product_id
        ],
      );

      if (rows.affectedRows > 0) {
        return await this.getById(data.id);
      } else {
        throw new Error("Failed to create review.");
      }
    } catch (error) {
      throw error
    }
  }
  update(id: string, data: Partial<Review>): Promise<Review | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default ReviewService