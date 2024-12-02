import * as z from 'zod'
import RoleSchema from './role.model'

const UserSchema = z.object({
  id: z.number().positive().int(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  role: RoleSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
})

const SignInSchema = UserSchema.required({
  email: true,
  password: true
}).pick({ email: true, password: true })

type SignInType = z.infer<typeof SignInSchema>

const checkSignIn = (signIn: SignInType) => {
  return SignInSchema.safeParse(signIn)
}

const SignUpSchema = UserSchema.required({
  name: true,
  email: true,
  password: true
}).pick({
  name: true,
  email: true,
  password: true
})
type SignUpType = z.infer<typeof SignUpSchema>

const checkSignUp = (signUp: SignUpType) => {
  return SignUpSchema.safeParse(signUp)
}

export { UserSchema, checkSignIn, checkSignUp }