import { Request, Response } from 'express'
import { IProductCtrl } from '../types'
import { RepeatedProduct, UnauthorizedAction } from '../lib/error-factory'
import { checkProduct, checkUpdateProduct } from '../models/product.model'
import { z } from 'zod'

export default class UserController implements IProductCtrl {
  async findProductsByName(req: Request, res: Response) {
    try {
      const storage = new Storage()
      if (!res.locals.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Get products by name')
      }
      const { name } = req.params
      const { data, error } = z
        .string({
          invalid_type_error: 'Name must be a string',
          required_error: 'Name is required'
        })
        .safeParse(name)
      if (error) return res.status(422).json(error)
      const products = await storage.getProductsByName({
        name: data
      })
      return res.json(products.slice(0, 4))
    } catch (e) {
      console.error(e)
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        return res.status(400).json({ msg: 'Unexpected Error' })
      }
    }
  }

  async findAllProducts(_: Request, res: Response) {
    try {
      const storage = new Storage()
      if (!res.locals.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Get products')
      }
      const products = await storage.getAllProducts()

      return res.json(products)
    } catch (e) {
      console.error(e)
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        return res.status(400).json({ msg: 'Unexpected Error' })
      }
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const storage = new Storage()
      if (!res.locals.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Create new product')
      }
      const { name, stock, unitId } = req.body
      const id = await storage.getUnitById({ id: unitId })
      const { data, error } = checkProduct({
        name: name,
        stock: stock,
        unitId: id
      })
      if (error) return res.status(422).json(error)

      const newProduct = await storage.createProduct({
        name: data.name,
        stock: data.stock,
        volume: data.unitId
      })

      return res.json(newProduct)
    } catch (e) {
      console.error(e)
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else if (e instanceof RepeatedProduct) {
        return res.status(401).json({ msg: e.message })
      } else {
        return res.status(400).json({ msg: 'Unexpected Error' })
      }
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const storage = new Storage()
      if (!res.locals.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Update product')
      }
      const { data: productId, error: idError } = z
        .number()
        .safeParse(Number(req.params.id))
      const { name, stock, unitId } = req.body
      const { data: productFields, error: fieldsError } = checkUpdateProduct({
        name: name,
        stock: stock,
        unitId: unitId
      })

      if (fieldsError) return res.status(422).json({ msg: fieldsError })
      if (idError) return res.status(404).json({ msg: productId })

      const updatedProduct = await storage.updateProduct({
        id: productId,
        name: productFields.name,
        stock: productFields.stock,
        unitId: productFields.unitId
      })
      return res.json(updatedProduct)
    } catch (e) {
      console.error(e)
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        return res.status(400).json({ msg: 'Unexpected Error' })
      }
    }
  }
}
