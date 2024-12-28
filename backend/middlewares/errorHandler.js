const { logEvents } = require('./logger');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
    console.log(err.stack);

    if (err instanceof AppError) {
        return res.status(err.statusCode).send({ message: err.message });
    }
    const status = res.statusCode ? res.statusCode : 500; // server error

    // return res.status(status).send({ message: err.message });
    return res.status(500).send({ message: "Internal Server Error" })
}

module.exports = errorHandler;