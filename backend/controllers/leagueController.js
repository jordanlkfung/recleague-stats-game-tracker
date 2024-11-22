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
} // Test Passed

/** /league/:_id */
// GET league by id
exports.getLeague = async function (req, res) {
    try {
        const league = await League.findById(req.params._id);
        if (league) {
            res.status(200).json(league);
        } else {
            res.status(404).send({ message: 'League not found.' });
        }
    } catch (err) {
        res.status(500).send({ message: 'An error occurred retrieving League.' });
    }
}; // Test Passed

/** /league/:_id/managers */
// GET Get all managers
exports.getLeagueManagers = async function (req, res) {
    try {
        const league = await League.findById(req.params._id).populate('managers')
        if (!league) {
            res.status(404).send({ message: 'League not found' });
        }
        else {
            res.status(200).send(league.managers);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // Test Passed

// POST Add managers to league
exports.addManagerToLeague = async function (req, res) {
    const leagueId = req.params._id;
    const managerId = req.body.managerId;
  
    try {
        const league = await League.findById(leagueId);

        if(!league) return res.status(404).json({ message: 'League not found.' });

        if(!league.managers) return res.status(404).json({ message: 'League\'s managers not found.' });


        const managers = league.managers.filter(item => item.toString() === managerId);

        if(managers.length > 0) {
            return res.status(400).json({ message: 'Manager exists in league.' });
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $push: { managers: managerId } }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
           return res.status(400).json({ message: 'No changes made to the league\'s managers.' });
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test Passed

// DELETE Delete manager from league
exports.deleteManagerFromLeague = async function (req, res) {
    const leagueId = req.params._id;
    const managerId = req.body.managerId;
  
    try {
        const league = await League.findById(leagueId);

        if(!league) return res.status(404).json({ message: 'League not found.' });

        if(!league.managers) return res.status(404).json({ message: 'League\'s managers not found.' });


        const managers = league.managers.filter(item => item.toString() === managerId);

        if(!managers.length > 0) {
            return res.status(400).json({ message: 'Manager does not exist in league.' });
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $pull: { managers: managerId } }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
           return res.status(400).json({ message: 'No changes made to the league\'s managers.' });
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASSED

/** /leagues/:_id/teams */
// GET Get all teams
exports.getLeagueTeams = async function (req, res) {
    try {
        const league = await League.findById(req.params._id).populate('teams');
        res.status(200).send(league.teams);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // Test PASSED

// POST Add team to league
exports.addTeamToLeague = async function (req, res) {
    const leagueId = req.params._id;
    const teamId = req.body.teamId;

    try {
        const league = await League.findById(leagueId);

        if(!league) return res.status(404).json({ message: 'League not found.' });

        if(!league.teams) return res.status(404).json({ message: 'League\'s team not found.' });


        const teams = league.teams.filter(item => item.toString() === teamId);

        if(teams.length > 0) {
            return res.status(400).json({ message: 'Team exists in league.' });
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $push: { teams: teamId } }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
           return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Not tested

// DELETE Delete team from league
exports.deleteTeamFromLeague = async function (req, res) {
    const leagueId = req.params._id;
    const teamId = req.body.teamId;

    try {
        const league = await League.findById(leagueId);

        if(!league) return res.status(404).json({ message: 'League not found.' });

        if(!league.teams) return res.status(404).json({ message: 'League\'s team not found.' });


        const teams= league.teams.filter(item => item.toString() === teamId);

        if(!teams.length > 0) {
            return res.status(400).json({ message: 'Team does not exist in league.' });
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $pull: { teams: teamId } }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
           return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Not tested

/** /leagues/:_id/seasons */
// GET Get all seasons
exports.getLeagueSeasons = async function (req, res) {
    try {
        const league = await League.findById(req.params._id);
        if (!league) return res.status(404).send({ message: 'League not found' });

        if(!league.seasons) return res.status(404).send({ message: 'Seasons not found' });

        res.status(200).send(league.seasons)
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occurred' })
    }
}  // Test Passed


// POST Add season to seasons
exports.addSeasonToSeasons = async function (req, res) {
    const leagueId = req.params._id;

    try {
        const league = await League.findById(leagueId);

        if (!league) return res.status(404).json({ message: 'League not found.' });

        if (!req.body.start_date || !req.body.end_date) {
            return res.status(400).json({ message: 'Invalid form fields.' });
        }

        const newStartDate = new Date(req.body.start_date);
        const newEndDate = new Date(req.body.end_date);

        if(league.seasons && league.seasons.length > 0) {
            const seasonOverlap = league.seasons.some(season => {
                const existingStartDate = new Date(season.start_date);
                const existingEndDate = new Date(season.end_date);
    
                return (
                    (newStartDate >= existingStartDate && newStartDate <= existingEndDate) ||  
                    (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||      
                    (newStartDate <= existingStartDate && newEndDate >= existingEndDate)      
                );
            });

            if (seasonOverlap) {
                return res.status(400).json({ message: 'The new season dates overlap with an existing season.' });
            }
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $push: { seasons : {
                start_date: newStartDate,
                end_date: newEndDate,
            }} }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
           return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASSED

// DELETE Delete season from seasons
exports.deleteSeasonFromSeasons = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.body.seasonId;

    try {
        const league = await League.findById(leagueId);

        if(!league) return res.status(404).json({ message: 'League not found.' });

        if(!league.seasons) return res.status(404).json({ message: 'League\'s seasons not found.' });


        const seasons = league.seasons.filter(item => item._id.toString() === seasonId);
        
        if(!seasons.length > 0) {
            return res.status(400).json({ message: 'Season does not exist in league.' });
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $pull: { seasons: { _id: seasonId } } }
        );

        if (result) {
            return res.status(200).json(result); 
        } else {
           return res.status(400).json({ message: 'No changes made to the league\'s seasons.' });
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASSED

/** /leagues/:_id/seasons/:_sid */
// GET Get season by sid
exports.getSeason = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.params._sid;

    try {
        const league = await League.findById(
            { _id: leagueId }
        );

        if (!league) return res.status(404).send({ message: 'League not found.' });

        const season = league.seasons.find(s => s._id.toString() === seasonId);

        if (!season) return res.status(404).send({ message: 'Season not found.' });

        res.status(200).json(season); 
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'An error occurred retrieving League.' });
    }
}; // Test Passed

// POST Add games to season
exports.addGameToSeason = async function (req, res) {

}

// DELETE Delete game from season
exports.deleteGameFromSeason = async function (req, res) {
    
}

/** /:sport */
// :sport is the enum 
// GET Get leagues by sport
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
} // Not tested

//GET specific season
exports.getLeagueSeason = async function (req, res) {
    try {
        const season = await League.find({ seasons: { $elemMatch: { uniqueIdentifier: req.params.seasonID } } }, { seasons: 1 });
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occurred' });
    }
} // Not tested