import { NextFunction, Request, Response } from 'express'
import type Execute from '../types/Execute'

class Route {
  execute: Execute
  params?: string[]
  withAuthorization?: boolean

  constructor(execute: Execute, options?: { params?: string[]; withAuthorization?: boolean }) {
    this.withAuthorization = this.withAuthorization
    this.execute = execute

    if (options) {
      if (options.params) this.params = options.params
      if (options.withAuthorization) this.withAuthorization = options.withAuthorization
    }
  }

  authorization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<NextFunction | Response> | NextFunction | Response | void {
    const { tokenType, accessToken } = req.session

    if (!tokenType || !accessToken) {
      return res.status(401).send({ error: 'No tokens stored in session' })
    }

    return next()
  }
}

export default Route
