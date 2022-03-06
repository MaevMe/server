import { Request, Response } from 'express'

type Execute = (req: Request, res: Response) => Promise<Response> | Response | void | Promise<any>
export default Execute
