class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        // this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

module.exports = AppError