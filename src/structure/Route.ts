import { NextFunction, Request, Response, Router } from 'express'
import type Execute from '../types/Execute'

class Route {
  execute: Execute
  params?: string[]
  auth?: boolean

  constructor (execute: Execute, options?: { params?: string[], auth?: boolean }) {
    this.auth = false
    this.execute = execute

    if (options) { 
      if (options.params) this.params = options.params
      if (options.auth) this.auth = options.auth
    }
  }

  authorization (req: Request, res: Response, next: NextFunction): Promise<NextFunction | Response> | NextFunction | Response | void {
    next()
  }
}

export default Route