import { NextFunction, Request, Response, Router } from 'express'
import type Execute from '../types/Execute'

class Route {
  execute: Execute
  params?: string[]
  auth?: boolean

  constructor(execute: Execute, options?: { params?: string[]; auth?: boolean }) {
    this.auth = this.auth
    this.execute = execute

    if (options) {
      if (options.params) this.params = options.params
      if (options.auth) this.auth = options.auth
    }
  }

  authorization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<NextFunction | Response> | NextFunction | Response | void {
    const { tokenType, accessToken } = req.session

    if (!tokenType || !accessToken) {
      return res.send({ error: 'No tokens stored in session' })
    }

    return next()
  }
}

export default Route
