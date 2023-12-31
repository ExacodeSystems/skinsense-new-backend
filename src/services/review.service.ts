import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Review } from "../@types/review.js";
import AbsService from "../abstracts/abs-service.js";
import pool from "../config/db.js";
import { v1 } from "uuid";

class ReviewService implements AbsService<Review> {
  async addLike(id: string): Promise<Review | null> {
    try {
      const [rows] = await pool.query<ResultSetHeader>(
        "UPDATE review SET total_likes = total_likes + 1 WHERE id = ?",
        [id],
      );
      
      if (rows.affectedRows > 0) {
        let review = await this.getById(id)
        return review;
      } else {
        throw new Error("Failed to add like.");
      }
    } catch (error) {
      throw error;
    }
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
  async getByProductId(product_id: string): Promise<Review[] | null> {
    try {
      const [rows] = await pool.query<Review[] & RowDataPacket[][]>(
        "SELECT * FROM review WHERE product_id = ? ORDER BY created_date DESC",
        [product_id],
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }
  async create(data: Review): Promise<Review | null> {
    try {
      const id = v1()
      const [rows] = await pool.query<ResultSetHeader>(
        "INSERT INTO review (id, rating, comment, user_id, product_id) VALUES (?, ?, ?, ?, ?)",
        [
          id,
          data.rating,
          data.comment,
          data.user_id,
          data.product_id
        ],
      );
      
      if (rows.affectedRows > 0) {
        let review = await this.getById(id)
        return review;
      } else {
        throw new Error("Failed to create review.");
      }
    } catch (error) {
      throw error
    }
  }
  getAll(): Promise<Review[]> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: Partial<Review>): Promise<Review | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default ReviewService