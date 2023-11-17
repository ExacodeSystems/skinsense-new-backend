import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../@types/user.js";
import AbsService from "../abstracts/abs-service.js";
import pool from "../config/db.js";

class UserService extends AbsService<User> {
  getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  async getById(id: string): Promise<User | null> {
    try {
      const [rows] = await pool.query<User[] & RowDataPacket[][]>(
        "SELECT * FROM user WHERE id = ?",
        [id],
      );
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  }
  async create(data: User): Promise<User | null> {
    try {
      const [rows] = await pool.query<ResultSetHeader>(
        "INSERT INTO user (id, email, name) VALUES (?, ?, ?)",
        [
          data.id,
          data.email,
          data.name
        ],
      );

      if (rows.affectedRows > 0) {
        return await this.getById(data.id);
      } else {
        throw new Error("Failed to create billing cycle.");
      }
    } catch (error) {
      throw error
    }
  }
  update(id: string, data: Partial<User>): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}

export default UserService