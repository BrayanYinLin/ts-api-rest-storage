import { Request, Response } from 'express'
import { IUnitCtrl } from '../types'
import { Storage } from '../database/database'
import { UnauthorizedAction } from '../lib/error-factory'

export default class UnitController implements IUnitCtrl {
  async findAll(_: Request, res: Response) {
    try {
      const storage = new Storage()
      if (!res.locals.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Get products by name')
      }

      const units = await storage.findAllUnits()

      return res.json(units)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        return res.status(400).json({ msg: 'unexpected error' })
      }
    }
  }
}
