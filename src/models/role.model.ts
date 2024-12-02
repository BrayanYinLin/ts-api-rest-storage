import * as z from 'zod'

const RoleSchema = z.object({
  id: z.number().positive().int(),
  description: z.string()
})

export default RoleSchema
