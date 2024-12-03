import { z } from 'zod'

const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  stock: z.number().int().positive(),
  unitId: z.number().positive().int(),
  unitName: z.string().optional()
})

export { ProductSchema }
