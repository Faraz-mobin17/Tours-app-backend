/**
 * @file app.error.js
 */

import {
  StatusCodes as code,
  getReasonPhrase as reason,
} from "http-status-codes";

class AppError extends Error {
  constructor(message) {
    super(message);
  }
}
/**
 * Represents a Bad Request error (HTTP 400).
 * This error is typically used to indicate that the server cannot process the request
 * due to client-side issues such as invalid input or malformed request syntax.
 *
 * @class BadRequestError
 * @extends {AppError}
 */
export class BadRequestError extends AppError {
  constructor(message) {
    this.statusCode = code.BAD_REQUEST;
    this.message = message;
    this.name = reason(code.BAD_REQUEST);
  }
}
/**
 * Represents a "Not Found" error.
 * Implements the `AppError` interface.
 * This error is typically used to indicate that a requested resource could not be found.
 *
 * @class InternalServerError
 * @extends {AppError}
 */
export class InternalServerError extends AppError {
  constructor(message) {
    this.statusCode = code.INTERNAL_SERVER_ERROR;
    this.message = message;
    this.name = reason(code.INTERNAL_SERVER_ERROR);
  }
}
/**
 * Represents an internal server error.
 * Implements the `AppError` interface.
 *
 * @class NotFoundError
 * @extends {AppError}
 */
export class NotFoundError extends AppError {
  constructor(message) {
    this.message = message;
    this.statusCode = code.NOT_FOUND;
    this.name = reason(code.NOT_FOUND);
  }
}
/**
 * Represents an Unauthorized error (HTTP 401).
 * This error is typically used to indicate that the request requires user authentication.
 *
 * @class UnauthorizedError
 * @extends {AppError}
 */
export class UnauthorizedError extends AppError {
  constructor(message) {
    this.message = message;
    this.stautsCode = code.UNAUTHORIZED;
    this.name = reason(code.UNAUTHORIZED);
  }
}

/**
 * Represents a Forbidden error (HTTP 403).
 * This error is typically used to indicate that the server understands the request
 * but refuses to authorize it.
 *
 * @class ForbiddenError
 * @extends {AppError}
 */
export class ForbiddenError extends AppError {
  constructor(message) {
    this.message = message;
    this.statusCode = code.FORBIDDEN;
    this.name = reason(code.FORBIDDEN);
  }
}
/**
 * Represents a Conflict error (HTTP 409).
 * This error is typically used to indicate that the request could not be completed
 * due to a conflict with the current state of the target resource.
 *
 * @class ConflictError
 * @extends {AppError}
 */
export class ConflictError extends AppError {
  constructor(message) {
    this.message = message;
    this.statusCode = code.CONFLICT;
    this.name = reason(code.CONFLICT);
  }
}

/**
 * Represents an error for unimplemented functionality.
 * This error is used to indicate that a certain feature or method
 * has not been implemented yet.
 *
 * @class NotImplementedError
 * @extends {AppError}
 */
export class NotImplementedError extends AppError {
  constructor(message) {
    this.message = message;
    this.statusCode = code.NOT_IMPLEMENTED;
    this.name = reason(code.NOT_IMPLEMENTED);
  }
}
