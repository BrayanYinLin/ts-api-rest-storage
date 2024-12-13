import { describe, expect, test } from 'vitest'
import { User } from '../types'
import { UserSchema } from '../models/user.model'

describe('User tests', () => {
  test('should not return errors', () => {
    const userForTest: User = {
      id: 1,
      email: 'byinlinm@gmail.com',
      name: 'Brayan Yin Lin',
      role: {
        id: 1,
        description: 'Administrator'
      },
      createdAt: '2020-01-01T00:00:00Z',
      password: '12Byinlin12'
    }

    const { error } = UserSchema.safeParse(userForTest)

    expect(error).not.toBeTruthy()
  })
})
