import { z } from 'zod'
import { Product } from '../types'

const ProductSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string(),
  stock: z.number().int().positive(),
  unitId: z.number().positive().int(),
  unitName: z.string().optional()
})

const checkProduct = (product: Product) => {
  return ProductSchema.safeParse(product)
}

const checkUpdateProduct = (product: Product) => {
  return ProductSchema.partial().safeParse(product)
}

export { ProductSchema, checkProduct, checkUpdateProduct }
