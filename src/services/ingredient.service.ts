import { RowDataPacket } from "mysql2"
import { Ingredient } from "../@types/ingredient.js"
import AbsService from "../abstracts/abs-service.js"
import pool from "../config/db.js"

class IngredientService extends AbsService<Ingredient> {
  getAll(): Promise<Ingredient[]> {
    throw new Error("Method not implemented.")
  }
  getById(id: string): Promise<Ingredient | null> {
    throw new Error("Method not implemented.")
  }
  create(data: Ingredient): Promise<Ingredient | null> {
    throw new Error("Method not implemented.")
  }
  update(id: string, data: Partial<Ingredient>): Promise<Ingredient | null> {
    throw new Error("Method not implemented.")
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  getByName = async (name: string) : Promise<Ingredient | null> => {
    try {
      const [rows] = await pool.query<Ingredient[] & RowDataPacket[][]>(
        "SELECT * FROM ingredients_new WHERE name = ?",
        [name],
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error
    }
  }
  getByNameFromAll = async (name: string) : Promise<Ingredient | null> => {
    try {
      const [rows] = await pool.query<Ingredient[] & RowDataPacket[][]>(
        "SELECT * FROM ingredients WHERE name = ?",
        [name],
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error
    }
  }
  getByGoodForSkinTypes = async (skinTypes: string[]) : Promise<Ingredient[] | null> => {
    try {
      let query = "SELECT * FROM ingredients_new"
      let queryParams : string[] = []
      
      skinTypes.map((skinType, index) => {
        if (index === 0) {
          query += " WHERE good_for_skin_type LIKE ?"
        } else {
          query += " OR good_for_skin_type LIKE ?"
        }
        queryParams.push(`%${skinType}%`);
      })

      const [rows] = await pool.query<Ingredient[] & RowDataPacket[][]>(query, queryParams);

      return rows
    } catch (error) {
      throw error
    }
  }
  getByGoodFor = async (concerns: string[]) : Promise<Ingredient[] | null> => {
    try {
      let query = "SELECT * FROM ingredients_new"
      let queryParams : string[] = []
      
      concerns.map((concern, index) => {
        if (index === 0) {
          query += " WHERE good_for LIKE ?"
        } else {
          query += " OR good_for LIKE ?"
        }
        queryParams.push(`%${concern}%`);
      })

      const [rows] = await pool.query<Ingredient[] & RowDataPacket[][]>(query, queryParams);

      return rows
    } catch (error) {
      throw error
    }
  }
}

export default IngredientService