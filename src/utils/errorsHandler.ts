import { NextFunction, Request, Response } from 'express'
import { ResponseError } from '../@types/error.js'

export const jsonErrorsHandler = (
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const responseCode = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(responseCode).json({
    error: message,
  })
}
