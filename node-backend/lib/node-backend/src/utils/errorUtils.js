"use strict";
// tslint:disable:max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = exports.UnexpectedError = exports.ValidationError = exports.BadRequestError = exports.EntityNotFoundError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(error) {
        super(error === null || error === void 0 ? void 0 : error.message);
        this.message = "Internal server error";
        this.statusCode = 500;
        this.type = "unspecified";
        Object.assign(this, error);
    }
}
exports.ApiError = ApiError;
class EntityNotFoundError extends ApiError {
    constructor(error) {
        super(error);
        this.message = "Entity not found";
        this.type = "entity_not_found";
        this.statusCode = 404;
        Object.assign(this, error);
    }
}
exports.EntityNotFoundError = EntityNotFoundError;
class BadRequestError extends ApiError {
    constructor(error) {
        super(error);
        this.message = "Bad Request";
        this.type = "bad_request";
        this.statusCode = 400;
        Object.assign(this, error);
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends ApiError {
    constructor(error) {
        super(error);
        this.message = "Validation error";
        this.type = "validation_error";
        this.statusCode = 400;
        Object.assign(this, error);
    }
}
exports.ValidationError = ValidationError;
class UnexpectedError extends ApiError {
    constructor(error) {
        super(error);
        this.message = "An unexpected error has occured";
        this.type = "unexpected";
        this.statusCode = 500;
        Object.assign(this, error);
    }
}
exports.UnexpectedError = UnexpectedError;
class AuthorizationError extends ApiError {
    constructor(error) {
        super(error);
        this.message = "Not authorized";
        this.type = "unauthorized";
        this.statusCode = 401;
        Object.assign(this, error);
    }
}
exports.AuthorizationError = AuthorizationError;
//# sourceMappingURL=errorUtils.js.map