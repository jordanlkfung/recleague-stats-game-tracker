var mongoose = require('mongoose');
User = mongoose.model('User');

// req.params._id is the ObjectID of the User Document
// Updating leagues needs the League's ObjectID in the request body (leagueId)

/** /user */
// POST Register
exports.addUser = async function (req, res) {
    var newUser = new User(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).send({ message: 'An error has occured while adding new User'});
    }
}; // Duplicate email, invalid email, and invalid password tests PASSED

// GET Get all users
exports.getAllUsers = async function (req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send({message: 'An error has occured while getting all Users'});
    }
}; // Test PASSED

/** /user/:_id */
// GET user by id 
exports.getUser = async function (req, res) {
    try {
        const user = await User.findById(req.params._id);
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).send({message: 'User not found.'});
        }
      } catch (err) {
        res.status(500).send({message: 'An error occurred retrieving user.'});
      }
}; // Test Passed

/** /user/:_id/leagues */
// GET user's league(s)'
exports.getUserLeagues = async function (req, res) {
    try {
        const user = await User.findById(req.params._id);

        if (!user) {
            return res.status(404).send({ message: 'User not found.' }); // Can populate leagues array with the League objects instead of ids
        }

        res.status(200).json(user.leagues); 
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred while retrieving the user leagues.' });
    }

}; // Test Passed

// PATCH add or remove league to user
exports.modifyLeaguesForUser = async function (req, res) {
    const userId = req.params._id;
    const { addLeagueId, removeLeagueId } = req.body; 

    try {
        const updateObj = {};

        if (addLeagueId) {
            updateObj.$addToSet = { leagues: addLeagueId }; 
        }

        if (removeLeagueId) {
            updateObj.$pull = { leagues: removeLeagueId }; 
        }

        if (Object.keys(updateObj).length > 0) {
            const user = await User.findByIdAndUpdate(
                userId,
                updateObj,
                { new: true } 
            ); // Can populate leagues array with the League objects instead of ids

            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }

            res.status(200).json(user.leagues); 
        } else {
            res.status(400).send({ message: 'No valid fields provided for update.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred while modifying the leagues.' });
    }
}; // Not tested

