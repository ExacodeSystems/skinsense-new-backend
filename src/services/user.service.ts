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
        "INSERT INTO user (id, email, name, skin_types, skin_concerns, allergens) VALUES (?, ?, ?, ?, ?, ?)",
        [
          data.id,
          data.email,
          data.name,
          data.skin_types,
          data.skin_concerns,
          data.allergens
        ],
      );

      if (rows.affectedRows > 0) {
        return await this.getById(data.id);
      } else {
        throw new Error("Failed to create user.");
      }
    } catch (error) {
      throw error
    }
  }
  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const q = "UPDATE user SET ? WHERE id = ?";
      const [result] = await pool.query<ResultSetHeader>(q, [data, id]);
  
      if (result.affectedRows > 0) {
        return await this.getById(id);
      } else {
        throw new Error("Failed to update user.");
      }
      // return result.affectedRows > 0 ? { await getUserById(id) } : null;
    } catch (err) {
      throw err;
    }
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}

export default UserService