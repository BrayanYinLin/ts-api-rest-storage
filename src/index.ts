import express from 'express'
// import cookieParser from 'cookie-parser'
// import cors from 'cors'
// //  Errors
// import jsonwebtoken from 'jsonwebtoken'
// import { MissingToken } from './lib/error-factory'
// //  Routes
import RouterUser from './routers/user.router'
// import RouterProduct from './routers/product.router'
// import RouterRecord from './routers/record.router'
// import RouterReport from './routers/report.router'
// import RouterUnit from './routers/unit.router'
// //  Dotenv
// import 'dotenv/config'
// //  Debug
// import morgan from 'morgan'

// const { TokenExpiredError } = jsonwebtoken
const port = process.env.PORT ?? 3000
const app = express()

// morgan.token('body', (req: Request) => JSON.stringify(req.body) || '-')
// morgan.token('origin', (req) => req.headers['origin'] || 'sin-origin')

// app.use(
//   morgan(
//     ':method - :url - :status - :response-time ms - origin: :origin - body: :body'
//   )
// )
// app.use((_, res, next) => {
//   res.setHeader('Cache-Control', 'no-store')
//   next()
// })

// app.use(express.json())
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const productionWeb =
//         process.env.PRODWEB === ''
//           ? process.env.PRODWEB
//           : 'https://storage-app-ten.vercel.app'
//       const allowedOrigins = [
//         'https://localhost:4173',
//         'https://localhost:5173',
//         productionWeb
//       ]

//       if (allowedOrigins.indexOf(origin ?? '') !== -1 || !origin) {
//         callback(null, true)
//       } else {
//         callback(new Error(`Not allowed by CORS ${origin}`))
//       }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   })
// )
// app.options(
//   '*',
//   cors({
//     origin: function (origin, callback) {
//       const productionWebsite = process.env.PRODWEB ?? 'null'
//       const allowedOrigins = ['https://localhost:5173', productionWebsite]

//       if (allowedOrigins.indexOf(origin ?? '') !== -1 || !origin) {
//         callback(null, true)
//       } else {
//         callback(new Error(`Not allowed by CORS ${origin}`))
//       }
//     },
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
//   })
// )
// app.use(cookieParser())
// app.use('/api/*', (req: Request, res: Response, next: NextFunction) => {
//   const AUTH_ROUTES = [
//     '/api/user/login',
//     '/api/user/register',
//     '/api/user/check',
//     '/api/user/refresh'
//   ]
//   try {
//     if (AUTH_ROUTES.some((route) => route === req.path)) {
//       return next()
//     }

//     //  Recupera las cookies
//     const token = req.cookies.access_token
//     const refresh_token = req.cookies.refresh_token

//     //  Verifica que existan
//     if (!token) throw new MissingToken('Missing Token')
//     if (!refresh_token) throw new MissingToken('Refresh token missing')

//     //  Las desencripta
//     const user = jsonwebtoken.verify(token, process.env.SECRET!.toString())
//     const refresh = jsonwebtoken.verify(
//       refresh_token,
//       process.env.REFRESH_SECRET!.toString()
//     )

//     //  Las agrega al session
//     res.locals.session = {
//       user: user,
//       refresh: refresh
//     }

//     // Continua la peticion
//     next()
//   } catch (e) {
//     if (e instanceof TokenExpiredError) {
//       res.status(401).json({ msg: 'Token expired' })
//     } else if (e instanceof MissingToken) {
//       res.status(401).json({ msg: e.message })
//     }
//   }
// })
app.use('/api/user', RouterUser)
// app.use('/api/product', RouterProduct)
// app.use('/api/record', RouterRecord)
// app.use('/api/report', RouterReport)
// app.use('/api/unit', RouterUnit)
// app.disable('x-powered-by')

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
