import { Router } from 'express'
import UnitController from '../controllers/unit.controller'

const RouterUnit = Router()
const ControllerUnit = new UnitController()

RouterUnit.get('/all', ControllerUnit.findAll)

export default RouterUnit
