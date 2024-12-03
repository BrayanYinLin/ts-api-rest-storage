import {
  LoggedUser,
  Product,
  ProductDAO,
  RegisteredUser,
  User,
  UserDAO,
  UserInfo
} from '../types'
import {
  NoRowsAffected,
  PasswordWrong,
  RepeatedProduct,
  UserNotFound
} from '../lib/error-factory'
import { createClient } from '@libsql/client'
import { hash, compare } from 'bcrypt'
import 'dotenv/config'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN
})

export class Storage implements UserDAO, ProductDAO {
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

  async findProductsByName({
    name
  }: Pick<Product, 'name'>): Promise<Product[]> {
    const { rows } = await turso.execute({
      sql: 'SELECT product_id, product_name, product_stock, volume_id FROM products_by_id WHERE product_name LIKE ?',
      args: [`%${name}%`]
    })

    if (rows.length === 0) return []

    return rows.map(
      (row): Product => ({
        id: row.product_id as number,
        name: row.product_name as string,
        stock: row.product_stock as number,
        unitId: row.volume_id as number
      })
    )
  }

  async findAllProducts(): Promise<Product[]> {
    const { rows } = await turso.execute({
      sql: 'SELECT * FROM view_product',
      args: []
    })

    if (rows.length === 0) return []

    return rows.map(
      (row): Product => ({
        id: row.product_id as number,
        name: row.product_name as string,
        stock: row.product_stock as number,
        unitId: row.volume_id as number
      })
    )
  }

  async createProduct({
    name,
    stock,
    unitId
  }: Omit<Product, 'id' | 'unitName'>): Promise<Omit<Product, 'unitName'>> {
    try {
      const { rowsAffected } = await turso.execute({
        sql: 'INSERT INTO "product"(product_name, product_stock, volume_id) VALUES (?, ?, ?);',
        args: [name, stock, unitId]
      })

      if (rowsAffected === 0)
        throw new NoRowsAffected('Error: No se pudo crear el producto')

      const {
        rows: [newProduct]
      } = await turso.execute({
        sql: 'SELECT * FROM view_product p WHERE productName = ? AND unitId = ?',
        args: [name, unitId]
      })

      return {
        id: newProduct.product_id as number,
        name: newProduct.product_name as string,
        stock: newProduct.product_stock as number,
        unitId: newProduct.unitId as number
      }
    } catch (e) {
      if (e instanceof NoRowsAffected) {
        throw e
      } else {
        throw new RepeatedProduct('This product already exists')
      }
    }
  }

  async updateProduct({
    id,
    name,
    stock,
    unitId
  }: Omit<Product, 'unitName'>): Promise<Omit<Product, 'unitName'>> {
    const { rowsAffected } = await turso.execute({
      sql: 'UPDATE product SET product_name = COALESCE(:product_name, product_name), product_stock = COALESCE(:product_stock, product_stock), volume_id = COALESCE(:volume_id, volume_id) WHERE product_id = :product_id',
      args: {
        product_id: id,
        product_name: name,
        product_stock: stock,
        volume_id: unitId
      }
    })

    if (rowsAffected === 0) {
      throw new Error('Product cannot be updated')
    }

    const {
      rows: [row]
    } = await turso.execute({
      sql: 'SELECT * FROM view_product WHERE productId = ?',
      args: [id]
    })

    return {
      id: row.product_id as number,
      name: row.product_name as string,
      stock: row.product_stock as number,
      unitId: row.unitId as number
    }
  }
}
