export const errorHandler = (err, c) => {
    console.error('Error occurred:', err);
    // Default error response
    let status = 500;
    let message = 'Internal Server Error';
    let errors = [];
    // Handle different types of errors
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation Error';
        errors = [err.message];
    }
    else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized';
        errors = ['Authentication required'];
    }
    else if (err.name === 'ForbiddenError') {
        status = 403;
        message = 'Forbidden';
        errors = ['Access denied'];
    }
    else if (err.name === 'NotFoundError') {
        status = 404;
        message = 'Not Found';
        errors = ['Resource not found'];
    }
    else if (err.message) {
        errors = [err.message];
    }
    // Don't expose internal errors in production
    if (c.env?.ENVIRONMENT === 'production' && status === 500) {
        message = 'Something went wrong';
        errors = ['Please try again later'];
    }
    return c.json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString(),
    }, status);
};
//# sourceMappingURL=errorHandler.js.map