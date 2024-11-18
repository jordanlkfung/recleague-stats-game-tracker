const mongoose = require('mongoose');
League = mongoose.model('League');

/** /league */
// POST Create new league
exports.addLeague = async function (req, res) {
    var newLeague = new League(req.body);

    try {
        const savedLeague = await newLeague.save();
        res.status(201).json(savedLeague);
    } catch (err) {
        res.status(500).send({ message: err });
    }
} // League name and sport enums tests PASSED

// GET Get all leagues
exports.getAllLeagues = async function (req, res) {
    try {
        const leagues = await League.find({});
        res.status(200).send(leagues);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' })
    } try {
        const leagues = await League.find({});
        res.status(200).json(leagues);
    } catch (err) {
        res.status(500).send({ message: 'An error has occured while getting all Leagues' });
    }
}

/** /leagues/:_id/managers */
// GET Get all managers
exports.getLeagueManagers = async function (req, res) {
    try {
        const managers = await League.findById(req.params._id, { managers: 1 }).populate('managers')
        if (!managers) {
            res.status(404).send({ message: 'League not found' });
        }
        else {
            res.status(200).send({ managers });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}

// PATCH Add or remove managers
exports.modifyManagersForLeague = async function (req, res) {
    const { managersToAdd, managersToRemove } = req.body;
    try {
        const updateObj = {};
        if (managersToAdd) {
            updateObj.$addToSet = isArray(managersToAdd) ? { managers: { $each: managersToAdd } } : { managers: managersToAdd };
        }
        if (managersToRemove) {
            updateObj.$pull = isArray(managersToRemove) ? { managers: { $each: managersToRemove } } : { managers: managersToRemove };
        }

        if (managersToRemove || managersToAdd) {
            const managers = await League.findByIdAndUpdate(req.params._id, updateObj, { new: true });
            if (managers) {
                res.status(200).send(managers);
            }
            else {
                res.status(404).send({ message: 'League not found' });
            }
        }
        else {
            res.status(400).send({ message: 'No valid fields provided for update.' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'Error occured while modify managers' });
    }
};

/** /leagues/:_id/teams*/
// GET Get all teams
exports.getLeagueTeams = async function (req, res) {
    try {
        const teams = await League.findById(req.params._id, { teams: 1 }).populate('teams');
        res.status(200).send(teams);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}

// PATCH Add or remove teams
exports.modifyLeagueTeams = async function (req, res) {
    const { teamsToAdd, teamsToRemove } = req.body;
    try {
        const updateObj = {}
        if (teamsToAdd) {
            updateObj.$addToSet = isArray(teamsToAdd) ? { teams: { $each: teamsToAdd } } : { teams: teamsToAdd };
        }
        if (teamsToRemove) {
            updateObj.$pull = isArray(teamsToRemove) ? { teams: { $each: teamsToRemove } } : { teams: teamsToRemove };
        }

        if (Object.keys(updateObj).length > 0) {
            const updatedLeague = await League.findByIdAndUpdate(req.body._id, updateObj, { new: true });
            if (!updatedLeague) {
                return res.status(404).send({ message: 'League not found.' });
            }

            res.status(201).send(updatedTeam);
        }
        else {
            res.status(400).send({ message: 'No valid fields provided for update.' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' })
    }
}

/** /leagues/:_id/seasons */
// GET Get all seasons
exports.getLeagueSeasons = async function (req, res) {
    try {
        const seasons = League.findById(req.params._id, { seasons: 1 });
        if (seasons) {
            res.status(200).send(seasons)
        }
        else {
            res.status(404).send({ message: 'League not found' })
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occured' })
    }
}


// PATCH Add or remove seasons
exports.modifySeasonsForLeague = async function (req, res) {
    const { seasonToAdd, seasonToDelete } = req.body;
    try {
        const updateObj = {};
        if (seasonToAdd) {
            updateObj.$addToSet = { seasons: seasonToAdd };
        }
        if (seasonToDelete) {
            updateObj.$pull = { seasons: seasonToDelete };
        }
        if (seasonToAdd || seasonToDelete) {
            const seasons = await League.findByIdAndUpdate(req.params._id, updateObj, { new: true });
            if (seasons) {
                res.status(200).send(seasons);
            }
            else {
                res.status(404).send({ message: 'League not found' });
            }
        }
        else {
            res.status(400).send({ message: 'No fields provided for update' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured while attempting to modify seasons' });
    }
}

exports.getLeaguesBySport = async function (req, res) {
    try {
        const leagues = await League.find({ sport: req.params.sport });
        if (!leagues) {
            res.status(404).send({ message: 'No leagues with entered sport were found' });
        }
        else {
            res.status(200).send(leagues);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}