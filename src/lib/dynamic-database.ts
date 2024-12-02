import 'dotenv/config'

export default async function loadStorage() {
  if (process.env.ENV === 'PRODUCTION') {
    return import('../database/database')
  } else {
    return import('../database/local')
  }
}
