var mongoose = require('mongoose'),
    User = mongoose.model('User');
Team = mongoose.model('Team')

exports.addUser = async function (req, res) {
    var newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).send({ message: 'An error has occured while adding new User' });
    }
}

exports.getUserLeagues = async function (req, res) {
    const leauges = await User.find({ email: req.body.email }, { leauges: 1, _id: 0 });

}

exports.joinLeague = async function (req, res) {

}

exports.leaveLeague = async function (req, res) {

}