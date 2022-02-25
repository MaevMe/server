import { NextFunction, Request, Response } from 'express'

type Execute = (req: Request, res: Response) => Promise<Response> | Response | void

export default Execute