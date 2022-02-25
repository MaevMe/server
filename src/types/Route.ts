import { NextFunction, Request, Response } from 'express'
import type Execute from './Execute'

type Route = {
  execute: Execute,
  params?: string[],
  auth?: boolean,
  authorization: (req: Request, res: Response, next: NextFunction) => Promise<NextFunction | Response> | NextFunction | Response | void
}

export default Route