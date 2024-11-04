require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { logger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(cors)

app.use(errorHandler);

app.use(express.json());

app.use(logger);

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI);

/** Routes */

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')) {
        req.json({message: '404 Not Found'});
    }
    else {
        res.type('txt').send('404 Not Found');
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
