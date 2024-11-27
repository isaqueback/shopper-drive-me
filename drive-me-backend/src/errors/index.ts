// errors/index.ts

import z from 'zod'

export class BaseError extends Error {
  error_code: string
  error_description: unknown

  constructor(error_code: string, error_description: string) {
    super()
    this.error_code = error_code
    this.error_description = error_description

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Error used for data validation in DTOs.
 * @class
 */
export class ValidationError extends BaseError {
  error_description: z.ZodIssue[] | string

  constructor(error_code: string, error_description: z.ZodIssue[] | string) {
    super(error_code, 'Data validation failed')
    this.error_description = error_description
  }
}

/**
 * Error used when a requested resource is not found.
 * @class
 */
export class NotFoundError extends BaseError {
  constructor(error_code: string, error_description: string) {
    super(error_code, error_description)
  }
}

/**
 * Error used when the server cannot generate a response acceptable to the client.
 * @class
 */
export class NotAcceptableError extends BaseError {
  constructor(error_code: string, error_description: string) {
    super(error_code, error_description)
  }
}

/**
 * Custom error class used for application-specific errors.
 * It allows defining an error code, description, and custom status code.
 * @class
 */
export class CustomError extends Error {
  error_code: string
  error_description: string
  status_code: number

  constructor(
    error_code: string,
    error_description: string,
    status_code: number,
  ) {
    super()
    this.error_code = error_code
    this.error_description = error_description
    this.status_code = status_code
  }
}

/**
 * Error used for database-related issues in Repositories.
 * @class
 */
export class DatabaseError extends BaseError {
  constructor(error_code: string, error_description: string) {
    super(error_code, error_description)
  }
}

/**
 * Error used for failures when interacting with external APIs.
 * @class
 */
export class ExternalServiceError extends BaseError {
  constructor(error_code: string, error_description: string) {
    super(error_code, error_description)
  }
}
