import { NextFunction, Request, Response } from "express"
import { authServiceInstance } from "../services/index.js";
import { User } from "../@types/user.js";

class AuthController {
  auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const user = await authServiceInstance.auth(userData)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController