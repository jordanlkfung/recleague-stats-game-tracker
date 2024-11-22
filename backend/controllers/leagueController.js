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
        res.status(500).send({ message: 'An error occurred' });
    }
} // League name and sport enums tests PASSED

// GET Get all leagues
exports.getAllLeagues = async function (req, res) {
    try {
        const leagues = await League.find({});
        res.status(200).json(leagues);
    } catch (err) {
        res.status(500).send({ message: 'An error has occurred while getting all Leagues' });
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
        res.status(500).send({ message: 'An error occurred' });
    }
}

// PATCH Add or remove managers
exports.modifyManagersForLeague = async function (req, res) {
    const { managersToAdd, managersToRemove } = req.body;
    try {
        const updateObj = {};

        if (managersToAdd) {
            updateObj.$addToSet = Array.isArray(managersToAdd) ? { managers: { $each: managersToAdd } } : { managers: managersToAdd };
        }
        if (managersToRemove) {
            updateObj.$pull = Array.isArray(managersToRemove) ? { managers: { $in: managersToRemove } } : { managers: managersToRemove };
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
            res.status(400).send({ message: "No fields provided for update" });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'Error occurred while modifying managers' });
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
        res.status(500).send({ message: 'An error occurred' });
    }
}

// PATCH Add or remove teams
exports.modifyLeagueTeams = async function (req, res) {
    const { teamsToAdd, teamsToRemove } = req.body;
    try {
        const updateObj = {}
        if (teamsToAdd) {
            updateObj.$addToSet = Array.isArray(teamsToAdd) ? { teams: { $each: teamsToAdd } } : { teams: teamsToAdd };
        }
        if (teamsToRemove) {
            updateObj.$pull = Array.isArray(teamsToRemove) ? { teams: { $in: teamsToRemove } } : { teams: teamsToRemove };
        }

        if (Object.keys(updateObj).length > 0) {
            const updatedLeague = await League.findByIdAndUpdate(req.params._id, updateObj, { new: true });
            if (!updatedLeague) {
                return res.status(404).send({ message: 'League not found.' });
            }

            res.status(201).send(updatedLeague);
        }
        else {
            res.status(400).send({ message: 'No valid fields provided for update.' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' })
    }
}

/** /leagues/:_id/seasons */
// GET Get all seasons
exports.getLeagueSeasons = async function (req, res) {
    try {
        const seasons = await League.findById(req.params._id, { seasons: 1 });
        if (seasons) {
            res.status(200).send(seasons)
        }
        else {
            res.status(404).send({ message: 'League not found' })
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occurred' })
    }
}


// PATCH Add or remove seasons
// seasonToDelete is the unique identifier for season
exports.modifySeasonsForLeague = async function (req, res) {
    const { seasonToAdd, seasonToDelete } = req.body;
    try {
        const updateObj = {};
        if (seasonToAdd) {
            updateObj.$addToSet = { seasons: seasonToAdd };
        }
        if (seasonToDelete) {
            // const seasonToDeleteID = await League.find({ _id: req.params._id }).where('seasons.uniqueIdentifier').equals(seasonToDelete);
            // if (!seasonToDeleteID) {
            //     res.status(404).send({ message: "Season to delete does not exist" });
            // }
            updateObj.$pull = { seasons: { uniqueIdentifier: seasonToDelete } }
            // updateObj.$pull = { seasons: seasonToDeleteID }
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

//Update season

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
        res.status(500).send({ message: 'An error occurred' });
    }
}

/**  */
//GET specific season
exports.getLeagueSeason = async function (req, res) {
    try {
        const season = await League.find({ seasons: { $elemMatch: { uniqueIdentifier: req.params.seasonID } } }, { seasons: 1 });
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occurred' });
    }
}