import { NextFunction, Request, Response } from "express";
import { userServiceInstance } from "../services/index.js";

class UserController {
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const user = await userServiceInstance.getById(userId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, name, email } = req.body;
      const createdUser = await userServiceInstance.create({
        id, name, email
      });
      res.json(createdUser);
    } catch (error) {
      next(error)
    }
  }

}

export default UserController