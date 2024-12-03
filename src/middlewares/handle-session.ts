import { Request, Response, NextFunction } from 'express'
import { MissingToken } from '../lib/error-factory'
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken'

const handleSession = (req: Request, res: Response, next: NextFunction) => {
  const AUTH_ROUTES = [
    '/api/user/login',
    '/api/user/register',
    '/api/user/check',
    '/api/user/refresh'
  ]
  try {
    if (AUTH_ROUTES.some((route) => route === req.path)) {
      return next()
    }

    //  Recupera las cookies
    const token = req.cookies.access_token
    const refresh_token = req.cookies.refresh_token

    //  Verifica que existan
    if (!token) throw new MissingToken('Missing Token')
    if (!refresh_token) throw new MissingToken('Refresh token missing')

    //  Las desencripta
    const user = jsonwebtoken.verify(token, process.env.SECRET!.toString())
    const refresh = jsonwebtoken.verify(
      refresh_token,
      process.env.REFRESH_SECRET!.toString()
    )

    //  Las agrega al session
    res.locals.session = {
      user: user,
      refresh: refresh
    }

    // Continua la peticion
    next()
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      res.status(401).json({ msg: 'Token expired' })
    } else if (e instanceof MissingToken) {
      res.status(401).json({ msg: e.message })
    }
  }
}

export default handleSession
