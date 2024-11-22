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
    catch (err) {
        res.status(500).send({ message: 'An error has occured' });
    }
}; // Duplicate email, invalid email, and invalid password tests PASSED

// GET Get all users
exports.getAllUsers = async function (req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send({ message: 'An error has occured while getting all Users' });
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
            res.status(404).send({ message: 'User not found.' });
        }
    } catch (err) {
        res.status(500).send({ message: 'An error occurred retrieving user.' });
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

// POST 
exports.addLeagueToUser = async (req, res) => {
    const userId = req.params._id;
    const leagueId= req.body.leagueId;
  
    try {
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({ message: 'User not found.' });

        if(!user.leagues) return res.status(404).json({ message: 'User\'s leagues not found.' });

        const leagues = user.leagues.filter(item => item.toString() === leagueId);

        if(leagues.length > 0) {
            return res.status(400).json({ message: 'League exists for the user.' });
        }

        const result = await User.updateOne(
            { _id: userId },
            { $push: { leagues: leagueId } }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
            return res.status(400).json({ message: 'No changes made to the user\'s leagues.' });
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}; // Test Passed

// DELETE Delete a user's league
exports.deleteLeagueFromUser = async (req, res) => {
    const userId = req.params._id;
    const leagueId= req.body.leagueId;
  
    try {
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({ message: 'User not found.' });

        if(!user.leagues) return res.status(404).json({ message: 'User\'s leagues not found.' });

        const leagues = user.leagues.filter(item => item.toString() === leagueId);

        if(!leagues.length > 0) {
            return res.status(400).json({ message: 'League does not exist for the user.' });
        }

        const result = await User.updateOne(
            { _id: userId },
            { $pull: { leagues: leagueId } }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
            return res.status(400).json({ message: 'No changes made to the user\'s leagues.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
  }; // Test PASSED