// error-handler.ts

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

import {
  BaseError,
  CustomError,
  DatabaseError,
  ExternalServiceError,
  NotAcceptableError,
  NotFoundError,
  ValidationError,
} from '.'

const errorMap = new Map<any, number>([
  [ValidationError, 400],
  [NotFoundError, 404],
  [NotAcceptableError, 406],
  [DatabaseError, 500],
  [ExternalServiceError, 502],
  [CustomError, 400],
])

export function errorHandler(
  error: FastifyError,
  req: FastifyRequest,
  res: FastifyReply,
) {
  const statusCode = errorMap.get(error.constructor) || 500

  if (error instanceof ValidationError) {
    const { error_code, error_description } = error

    return res.status(statusCode).send({
      error_code,
      error_description,
    })
  } else if (error instanceof BaseError) {
    const { error_code, error_description } = error

    return res.status(statusCode).send({
      error_code,
      error_description,
    })
  }

  if (error instanceof CustomError) {
    const { error_code, error_description, status_code } = error
    return res.status(status_code).send({
      error_code,
      error_description,
    })
  }

  // Default case for other errors
  return res.status(statusCode).send({
    error_code: error.message,
    error_description: error.name,
  })
}
