import { NextFunction, Request, Response } from "express"
import { authServiceInstance } from "../services/index.js";

class AuthController {
  auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, name, email } = req.body;
      const userData = await authServiceInstance.auth({
        id, name, email
      })
      res.json(userData)
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController