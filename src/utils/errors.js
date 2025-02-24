const CustomError = require('./CustomError');

class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ValidationError extends CustomError {
    constructor(message = 'Invalid input data') {
        super(message, 400);
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden action') {
        super(message, 403);
    }
}

module.exports = { NotFoundError, ValidationError, UnauthorizedError, ForbiddenError };
