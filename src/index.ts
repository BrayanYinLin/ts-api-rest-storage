import express from 'express'
import cookieParser from 'cookie-parser'
import { IncomingMessage } from 'http'
// Routes
import RouterUser from './routers/user.router'
import RouterProduct from './routers/product.router'
import RouterRecord from './routers/record.router'
import RouterReport from './routers/report.router'
import RouterUnit from './routers/unit.router'
// Dotenv
// import 'dotenv/config'
import morgan, { TokenCallbackFn } from 'morgan'
import handleOrigins from './middlewares/handle-origins'
import handleSession from './middlewares/handle-session'

const port = process.env.PORT ?? 3000
const app = express()

const bodyParse: TokenCallbackFn = (req: IncomingMessage) => {
  const parsed = req as unknown as Request

  return JSON.stringify(parsed.body) ?? ' '
}
morgan.token('body', bodyParse)
morgan.token('origin', (req) => req.headers['origin'] || 'sin-origin')

const format = ':method - :url - :status - origin: :origin - body: :body'
app.use(morgan(format))
// app.use((_, res, next) => {
//   res.setHeader('Cache-Control', 'no-store')
//   next()
// })

app.use(express.json())
app.use(handleOrigins())
app.options('*', handleOrigins())
app.use(cookieParser())
app.use(handleSession)

//  Routes
app.use('/api/user', RouterUser)
app.use('/api/product', RouterProduct)
app.use('/api/record', RouterRecord)
app.use('/api/report', RouterReport)
app.use('/api/unit', RouterUnit)
app.disable('x-powered-by')

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
