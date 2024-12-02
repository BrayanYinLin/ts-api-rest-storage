import { Router } from 'express'
import UserController from '../controllers/user.controller'

const ControllerUser = new UserController()
const RouterUser = Router()

RouterUser.get('/login', ControllerUser.signIn)
RouterUser.get('/register', ControllerUser.signUp)

export default RouterUser
