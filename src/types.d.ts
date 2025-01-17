import { z } from 'zod'
import { UserSchema } from './models/user.model'
import { ProductSchema } from './models/product.model'
import RoleSchema from './models/role.model'
import UnitSchema from './models/unit.model'
import { Request, Response } from 'express'

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleSchema>
export type Unit = z.infer<typeof UnitSchema>
export type Product = z.infer<typeof ProductSchema>

export type RegisteredUser = Required<Pick<User, 'email' | 'name' | 'password'>>
export type LoggedUser = Required<Pick<User, 'email' | 'password'>>

export type UserInfo = Pick<User, 'id' | 'name' | 'email'>
export type ErrorInfo = { msg: string | object }

export type Database = typeof Storage

export interface UserDAO {
  signUp(user: RegisteredUser): Promise<UserInfo>
  signIn(user: LoggedUser): Promise<UserInfo>
  refreshAccess({ id }: { id: Pick<User, 'id'> }): Promise<UserInfo>
}

export interface ProductDAO {
  findProductsByName({ name }: Pick<Product, 'name'>): Promise<Product[]>
  findAllProducts(): Promise<Product[]>
  createProduct({
    name,
    stock,
    unitId
  }: Omit<Product, 'id' | 'unitName'>): Promise<Omit<Product, 'unitName'>>
  updateProduct({
    id,
    name,
    stock,
    unitId
  }: Omit<Product, 'unitName'>): Promise<Omit<Product, 'unitName'>>
}

export interface UnitDAO {
  findAllUnits(): Promise<Unit[]>
  findUnitById({ id }: { id: Required<Pick<Unit, 'unitId'>> }): Promise<number>
}

export interface IProductCtrl {
  findProductsByName(req: Request, res: Response): Promise<void | Response>
  findAllProducts(req: Request, res: Response): Promise<void | Response>
  createProduct(req: Request, res: Response): Promise<void | Response>
  updateProduct(req: Request, res: Reponse): Promise<void | Response>
}

export interface IUserCtrl {
  signUp(req: Request, res: Response): Promise<void | Response>
  signIn(req: Request, res: Response): Promise<void | Response>
  refreshAccess(req: Request, res: Response): Promise<void | Response>
  logOut(req: Request, res: Response): Promise<void | Response>
  verifyAccess(req: Request, res: Response): Promise<void | Response>
}

export interface IUnitCtrl {
  findAll(req: Request, res: Response): Promise<void | Response>
}

export interface IReportCtrl {
  findExpensesReport(req: Request, res: Response): Promise<Response>
  findIncomesReport(req: Request, res: Response): Promise<Response>
}
