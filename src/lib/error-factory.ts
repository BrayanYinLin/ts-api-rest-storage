function createError({ name }: { name: string }) {
  return class CustomError extends Error {
    constructor(message: string) {
      super(message)
      this.name = name
    }
  }
}

export const VolumeNotFound = createError({
  name: 'VolumeNotFound'
})

export const RepeatedUserError = createError({
  name: 'RepeatedUserError'
})

export const UserNotFound = createError({
  name: 'UserNotFound'
})

export const PasswordWrong = createError({
  name: 'PasswordWrong'
})

export const UnauthorizedAction = createError({
  name: 'UnauthorizedAction'
})

export const MissingToken = createError({
  name: 'MissingToken'
})

export const MissingRefreshToken = createError({
  name: 'MissingRefreshToken'
})

export const RepeatedProduct = createError({
  name: 'RepeatedProduct'
})

export const UnexpectedCreateRecordError = createError({
  name: 'UnexpectedCreateRecordError'
})

export const RecordNotFound = createError({
  name: 'ProductNotFound'
})

export const NoRowsAffected = createError({
  name: 'NoRowsAffected'
})
