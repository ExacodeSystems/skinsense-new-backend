import { Todo } from "../@types/todo.js";
import AbsService from "../abstracts/abs-service.js";
import pool from "../config/db.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

class TodoService extends AbsService<Todo> {
  constructor() {
    super();
  }
  async getAll(): Promise<Todo[]> {
    try {
      const [rows] = await pool.query<Todo[] & RowDataPacket[][]>(
        "SELECT * FROM todos",
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }
  async getById(id: string): Promise<Todo | null> {
    try {
      const [rows] = await pool.query<Todo[] & RowDataPacket[][]>(
        "SELECT * FROM todos WHERE id = ?",
        [id],
      );
      return rows.length ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  }
  async create(data: Todo): Promise<Todo | null> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO todos (id, title, description) VALUES (?, ?, ?)",
        [data.id, data.title, data.description],
      );

      if (result.affectedRows > 0) {
        return await this.getById(data.id);
      } else {
        throw new Error("Failed to create todo data.");
      }
    } catch (err) {
      throw err;
    }
  }
  async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
    try {
      const q = "UPDATE user_backup_data SET ? WHERE id = ?";
      const [result] = await pool.query<ResultSetHeader>(q, [data, id]);

      if (result.affectedRows > 0) {
        return await this.getById(id);
      } else {
        throw new Error("Failed to update data.");
      }
    } catch (err) {
      throw err;
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM todos WHERE id = ?",
        [id],
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }
}

export default TodoService;
