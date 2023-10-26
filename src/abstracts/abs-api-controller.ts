import { NextFunction, Request, Response } from "express";
import AbsService from "./abs-service.js";

abstract class AbsApiController<Type> {
  abstract service: AbsService<Type>;

  abstract getAll : (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {}
  abstract getById : (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {}
  abstract create : (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {}
  abstract update : (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {}
  abstract delete : (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {}
}

export default AbsApiController;
