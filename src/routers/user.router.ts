import { Router } from 'express'
import UserController from '../controllers/user.controller'

const ControllerUser = new UserController()
const RouterUser = Router()

RouterUser.post('/login', ControllerUser.signIn)
RouterUser.post('/register', ControllerUser.signUp)
RouterUser.post('/refresh', ControllerUser.refreshAccess)
RouterUser.post('/logout', ControllerUser.logOut)
RouterUser.get('/check', ControllerUser.verifyAccess)

export default RouterUser
