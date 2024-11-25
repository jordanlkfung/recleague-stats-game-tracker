require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { logger } = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');
const cors = require('cors');
const corsOptions = require('./config/corsOptions.js');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(cors())

app.use(errorHandler);

app.use(express.json());

app.use(logger);

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI);

/** Routes */
// User Route
User = require('./models/User.js');
var userRoute = require('./routes/userRoutes.js');
app.use('/user', userRoute);

// League Route
League = require('./models/League.js');
var leagueRoute = require('./routes/leagueRoutes.js');
app.use('/league', leagueRoute);

Team = require('./models/Team.js');
var teamRoute = require('./routes/teamRoutes.js');
app.use('/team', teamRoute);

Game = require('./models/Game.js');
var teamRoute = require('./routes/gameRoutes.js');
app.use('/game', teamRoute);

Player = require('./models/Player.js')
var playerRoute = require('./routes/playerRoutes.js');
app.use('/player', playerRoute);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', '404.html'));
    }
    else if (req.accepts('json')) {
        req.json({ message: '404 Not Found' });
    }
    else {
        res.type('txt').send('404 Not Found');
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
