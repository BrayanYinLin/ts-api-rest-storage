import { Request, Response } from 'express'
import { IReportCtrl } from '../types'
import { UnauthorizedAction } from '../lib/error-factory'
import { Storage } from '../database/database'
import { createReportBase64, getMonth } from '../lib/utils'

export default class ReportController implements IReportCtrl {
  async findExpensesReport(req: Request, res: Response) {
    try {
      const storage = new Storage()
      if (!res.locals.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Get products by name')
      }
      const { month, year } = req.query
      const resume = await storage.findOutcomesResumeByMonthAndYear({
        month: Number(month),
        year: Number(year)
      })

      const requestMonth = getMonth({ index: Number(month), lang: 'es-ES' })
      const excelBuffer = await createReportBase64({
        data: resume,
        month: requestMonth
      })

      res.setHeader('Content-Disposition', 'attachment; filename=datos.xlsx')
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )

      return res.send(excelBuffer)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        console.error(e)
        return res
          .status(400)
          .json({ msg: 'unexpected error at report endpoint' })
      }
    }
  }

  async findIncomesReport(req: Request, res: Response) {
    try {
      const storage = new Storage()
      if (!res.locals.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Get products by name')
      }
      const { month, year } = req.query
      const resume = await storage.findIncomesResumeByMonthAndYear({
        month: Number(month),
        year: Number(year)
      })

      const requestMonth = getMonth({ index: Number(month), lang: 'es-ES' })
      const excelBuffer = await createReportBase64({
        data: resume,
        month: requestMonth
      })

      return res
        .set({
          'Content-Disposition': `attachment; filename=Reporte_${requestMonth}.xlsx`,
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        .send(excelBuffer)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        console.error(e)
        return res
          .status(400)
          .json({ msg: 'unexpected error at report endpoint' })
      }
    }
  }
}
