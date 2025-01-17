import { Request, Response } from 'express'
import { IUserCtrl } from '../types'
import { Storage } from '../database/database'
import { checkSignIn, checkSignUp } from '../models/user.model'
import { sign, verify } from 'jsonwebtoken'
import 'dotenv/config'
import { MissingToken } from '../lib/error-factory'

export default class UserController implements IUserCtrl {
  TIME_TO_ACCESS: number = 1000 * 60 * 60 * 4 //  4 horas
  TIME_TO_REFRESH_ACCESS: number = 1000 * 60 * 60 * 24 * 10 //  10 dias

  async signUp(req: Request, res: Response): Promise<void | Response> {
    try {
      const storage = new Storage()
      const { email, password, name } = req.body

      const { data, error } = checkSignUp({ name, email, password })

      if (error) return res.status(422).json(error.message)

      const newUser = {
        email: data.email,
        password: data.password,
        name: data.name
      }

      const userCreated = await storage.signUp(newUser)
      const token = sign(userCreated, process.env.SECRET!, {
        expiresIn: '4h'
      })
      const refreshToken = sign(
        { user_id: userCreated.id },
        process.env.REFRESH_SECRET!,
        {
          expiresIn: '10d'
        }
      )

      res
        .cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: this.TIME_TO_ACCESS
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: this.TIME_TO_REFRESH_ACCESS
        })
        .json(userCreated)
    } catch (e) {
      res.status(422).json({ msg: e })
    }
  }

  async signIn(req: Request, res: Response): Promise<void | Response> {
    try {
      const storage = new Storage()
      const { email, password } = req.body
      const { data, error } = checkSignIn({ email, password })

      if (error) {
        return res.status(403).json({ msg: error })
      }

      const logged = await storage.signIn({
        email: data.email,
        password: data.password
      })

      const accessToken = sign(logged, process.env.SECRET!, {
        expiresIn: '4h'
      })

      const refreshToken = sign(
        { id: logged.id },
        process.env.REFRESH_SECRET!,
        {
          expiresIn: '10d'
        }
      )

      return res
        .cookie('access_token', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: this.TIME_TO_ACCESS
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: this.TIME_TO_REFRESH_ACCESS
        })
    } catch (e) {
      console.error(e)
    }
  }

  async refreshAccess(_: Request, res: Response): Promise<void | Response> {
    res.json({ msg: 'test' })
  }

  async logOut(_: Request, res: Response): Promise<void | Response> {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ msg: 'Logout successfull' })
  }

  async verifyAccess(req: Request, res: Response): Promise<void | Response> {
    try {
      const SECRET_FOR_ACCESS = process.env.SECRET
      if (!SECRET_FOR_ACCESS) throw new MissingToken('No token sent')

      const token = verify(req.cookies.access_token, SECRET_FOR_ACCESS)

      if (token) {
        res.status(200).json({ msg: 'Everything is ok' })
      }
    } catch (e) {
      res.status(403).json(e)
    }
  }
}
