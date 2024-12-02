import { Request, Response } from 'express'
import { ControllerUser, Database } from '../types'

export default class UserController implements ControllerUser {
  storage: Database | null = null

  async signIn(_: Request, res: Response): Promise<void> {
    res.json({ msg: 'This works ok' })
  }

  async signUp(_: Request, res: Response): Promise<void> {
    res.json({ msg: 'This. works too' })
  }
}
