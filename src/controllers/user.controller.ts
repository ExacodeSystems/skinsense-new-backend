import { NextFunction, Request, Response } from "express";
import { userServiceInstance } from "../services/index.js";
import { User } from "../@types/user.js";

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
      const userData: User = req.body;
      const createdUser = await userServiceInstance.create(userData);
      res.json(createdUser);
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      if(!id) throw new Error("Id can't be null")
      const deletedUser = await userServiceInstance.delete(id)
      res.json({
        status: deletedUser
      });
    } catch (error) {
      next(error)
    }
  }

}

export default UserController