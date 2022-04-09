// tslint:disable:max-classes-per-file

export class ApiError extends Error {
  public message: string = "Internal server error";
  public statusCode: number = 500;
  public details?: any;
  public type: string = "unspecified";
  constructor(error?: Partial<ApiError>) {
    super(error?.message);
    Object.assign(this, error);
  }
}

export class EntityNotFoundError extends ApiError {
  public message = "Entity not found";
  public type = "entity_not_found";
  public statusCode = 404;
  constructor(error?: Partial<EntityNotFoundError>) {
    super(error);
    Object.assign(this, error);
  }
}
export class BadRequestError extends ApiError {
  public message = "Bad Request";
  public type = "bad_request";
  public statusCode = 400;
  constructor(error?: Partial<BadRequestError>) {
    super(error);
    Object.assign(this, error);
  }
}
export class ValidationError extends ApiError {
  public message = "Validation error";
  public type = "validation_error";
  public statusCode = 400;
  constructor(error?: Partial<ValidationError>) {
    super(error);
    Object.assign(this, error);
  }
}
export class UnexpectedError extends ApiError {
  public message = "An unexpected error has occured";
  public type = "unexpected";
  public statusCode = 500;
  constructor(error?: Partial<UnexpectedError>) {
    super(error);
    Object.assign(this, error);
  }
}
export class AuthorizationError extends ApiError {
  public message = "Not authorized";
  public type = "unauthorized";
  public statusCode = 401;
  constructor(error?: Partial<AuthorizationError>) {
    super(error);
    Object.assign(this, error);
  }
}
