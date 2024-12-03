import cors from 'cors'

// const productionWeb = process.env.PRODWEB === '' ? '' : ''

const admittedOrigins = ['https://localhost:4173', 'https://localhost:5173', '']

export default function handleOrigins() {
  return cors({
    origin: function (origin, callback) {
      if (admittedOrigins.indexOf(origin ?? '') !== -1) {
        callback(null, true)
      } else {
        callback(new Error(`Not allowed by CORS ${origin}`))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
}
