import { LoggedUser, RegisteredUser, User, UserDAO, UserInfo } from '../types'
import { PasswordWrong, UserNotFound } from '../lib/error-factory'
import { createClient } from '@libsql/client'
import { hash, compare } from 'bcrypt'
import 'dotenv/config'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN
})

export class Storage implements UserDAO {
  async signUp({ name, email, password }: RegisteredUser): Promise<UserInfo> {
    const salts = Number(process.env.SALTS_ROUNDS)
    const hashedPassword = await hash(password, salts)

    await turso.execute({
      sql: `INSERT INTO user (user_email, user_name, user_password) VALUES (:email, :name, :password);`,
      args: { email, name, password: hashedPassword }
    })

    const { rows } = await turso.execute({
      sql: 'SELECT user_id, user_email, user_name FROM user WHERE user_email = ?;',
      args: [email]
    })

    return {
      id: Number(rows[0].user_id),
      email: String(rows[0].user_email),
      name: String(rows[0].user_name)
    }
  }

  async signIn({ email, password }: LoggedUser): Promise<UserInfo> {
    const { rows } = await turso.execute({
      sql: `SELECT user_id, user_email, user_name, user_password FROM user WHERE user_email = ?`,
      args: [email]
    })
    if (rows.length === 0) throw new UserNotFound('User does not exists')

    const isOk = await compare(password, String(rows[0].user_password))
    if (!isOk) throw new PasswordWrong('Password wrong')

    return {
      id: Number(rows[0].user_id),
      email: String(rows[0].user_email),
      name: String(rows[0].user_name)
    }
  }

  async refreshAccess({ id }: { id: Pick<User, 'id'> }): Promise<UserInfo> {
    const { rows } = await turso.execute({
      sql: 'SELECT user_id, user_email, user_name FROM "user" WHERE user_id = ?',
      args: [String(id)]
    })

    if (rows.length === 0) throw new Error('User does not exist')

    return {
      id: Number(rows[0].user_id),
      email: String(rows[0].user_email),
      name: String(rows[0].user_name)
    }
  }
}
