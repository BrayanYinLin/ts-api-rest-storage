import { z } from 'zod'
import { UserSchema } from './models/user.model'
import RoleSchema from './models/role.model'
import UnitSchema from './models/unit.model'
import { Request, Response } from 'express'

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleSchema>
export type Unit = z.infer<typeof UnitSchema>

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

export interface ControllerUser {
  signUp(req: Request, res: Response): Promise<void | Response>
  signIn(req: Request, res: Response): Promise<void | Response>
  refreshAccess(req: Request, res: Response): Promise<void | Response>
}

export interface UnitDAO {
  findAllUnits(): Promise<Unit[]>
  findUnitById({ id }: { id: Pick<Unit, 'id'> }): Promise<Pick<Unit, 'unitId'>>
}
