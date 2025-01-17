const { logEvents } = require('./logger');
const AppError = require('../AppError');
const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
    console.log(err.stack);

    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({
            type: "Validation Error",
            message: err.message
        })
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(500).send({
            type: "Cast Error",
            message: err.message
        })
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).send({
            type: "App Error",
            message: err.message
        });
    }

    return res.status(500).send({ message: "Internal Server Error" })
}

module.exports = errorHandler;