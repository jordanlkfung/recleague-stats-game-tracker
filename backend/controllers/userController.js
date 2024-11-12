var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.addUser = async function (req, res) {
    var newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).send({ message: 'An error has occured while adding new User' })
    }
}