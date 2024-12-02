import { z } from 'zod'

const UnitSchema = z.object({
  unitId: z.number().positive().int(),
  unitName: z.string()
})

export default UnitSchema
