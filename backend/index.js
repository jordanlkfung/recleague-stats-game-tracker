require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { logger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(errorHandler);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
