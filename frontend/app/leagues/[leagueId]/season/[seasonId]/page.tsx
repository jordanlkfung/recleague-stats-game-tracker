'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


interface Season {
    _id: string;
    start_date: string;
    end_date: string;
}

interface Game {
    result: {
        winner: string | null;
        loser: string | null;
        tie: boolean;
    };
    _id: string;
    date: string;
    time: string;
    teams: TeamReference[];
}


interface Team {
    _id: string;
    name: string;
}

interface TeamReference {
    team: string;
    score: number;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Formats as MM/DD/YYYY
};

interface addTeamModalProps {
    leagueId: string,
    seasonId: string,
    open: boolean,
    handleClose: () => void
}
const AddTeamModal: React.FC<addTeamModalProps> = ({ leagueId, seasonId, open, handleClose }) => {
    const [teamName, setTeamName] = useState('');
    const [errorMessage, setErrorMessage] = useState();

    const handleAddTeam = async () => {

        const response = await fetch(`/api/leagues/${leagueId}/season/${seasonId}/team`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: teamName })
        },);


        if (!response.ok) {
            const error = await response.json();
            setErrorMessage(error.message);
        }
        else {
            handleClose();
        }
    }


    const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.target.value);
    }
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl w-1/3 flex items-center justify-center">
                    <TextField variant='outlined' value={teamName} onChange={handleTeamNameChange} label="Team Name" error={Boolean(errorMessage)} helperText={errorMessage} placeholder='Team Name'></TextField>
                    <Button variant='outlined'>Add</Button>
                </div>
            </div>
        </Modal>
    );
}

interface addGameModalProps {
    teams: Team[],
    seasonId: string,
    leagueId: string,
    open: boolean,
    handleClose: () => void
}

const AddGameModal: React.FC<addGameModalProps> = ({ teams, seasonId, leagueId, open, handleClose }) => {

    const [team1, setTeam1] = useState<Team | null>(null);
    const [team2, setTeam2] = useState<Team | null>(null);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const createGame = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        // const response = await fetch(`/api/leagues/${leagueId}/season/${seasonId}/team`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name })
        // },);


        // if (!response.ok) {
        //     throw Error("");
        // }

        console.log(`Date: ${date}`);
        console.log(`Time: ${time}`);
        console.log(`Team 1: ${team1}`);
        console.log(`Team 2: ${team2}`);
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTime(event.target.value);
    };

    const handleTeam1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // setTeam1(event.target.value);
    };

    const handleTeam2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // setTeam2(event.target.value);
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl w-1/3 flex items-center justify-center">
                    (
                    <form className="grid grid-rows-1 gap-2">
                        <label htmlFor="date" className="mb-0 text-blue-400">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            required
                            className="rounded-md text-black p-3 w-full border-blue-500 outline-1 border-2"
                        />
                        <label htmlFor="time" className="mb-0 text-blue-400">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            required
                            className="rounded-md text-black p-3 w-full border-blue-500 outline-1 border-2"
                        />
                        <label htmlFor="team1" className="mb-0 text-blue-400">Team 1</label>
                        <select
                            id="team1"
                            value={team1?.name.toString()}
                            onChange={handleTeam1Change}
                            required
                            className="rounded-md text-black p-3 w-full border-blue-500 outline-1 border-2"
                        >
                            <option value="">Select Team</option>
                            {teams.map((team) => (
                                <option key={team._id} value={team._id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="team2" className="mb-0 text-blue-400">Team 2</label>
                        <select
                            id="team2"
                            value={team2?.name.toString()}
                            onChange={handleTeam2Change}
                            required
                            className="rounded-md text-black p-3 w-full border-blue-500 outline-1 border-2"
                        >
                            <option value="">Select Team</option>
                            {teams
                                .filter((team) => team._id !== team1?._id)
                                .map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.name}
                                    </option>
                                ))}
                        </select>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="bg-red-700 text-white px-4 py-2 rounded-lg w-1/2"
                                onClick={handleClose}>
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-1/2"
                                onClick={createGame}>
                                Create
                            </button>
                        </div>
                        {errorMsg && <div className="text-red-500 p-2">{errorMsg}</div>}
                    </form>
                    )
                </div>
            </div>
        </Modal>
    )
}
export default function SeasonDetails() {
    const router = useRouter();
    const { leagueId, seasonId } = useParams();
    const [season, setSeason] = useState<Season>();
    const [games, setGames] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([{ _id: 'abc', name: "test" }, { _id: 'b', name: "tess1" }]);
    const [activeTab, setActiveTab] = useState<'games' | 'teams'>('teams'); // To toggle between games and teams
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchSeason = async () => {
            try {
                const response = await fetch(`/api/leagues/${leagueId}/season/${seasonId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data: Season = await response.json();
                    setSeason(data);
                } else {
                    console.error('Error fetching season by ID');
                }
            } catch (error) {
                console.error('An error occurred while fetching season by ID', error);
            }
        }

        const fetchTeams = async () => {
            try {
                const response = await fetch(`/api/leagues/${leagueId}/season/${seasonId}/team`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data: Team[] = await response.json();
                    setTeams(data);
                } else {
                    console.error('Error fetching teams');
                }
            } catch (error) {
                console.error('An error occurred while fetching teams', error);
            }
        }

        const fetchGames = async () => {
            try {
                const response = await fetch(`/api/leagues/${leagueId}/season/${seasonId}/game`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data: Game[] = await response.json();

                    const gamesWithTeams = await Promise.all(
                        data.map(async (game) => {
                            const teamsWithDetails = await Promise.all(
                                game.teams.map(async (teamReference) => {
                                    const teamId = teamReference.team;

                                    const response = await fetch(`/api/teams/${teamId}`, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    });

                                    if (response.ok) {
                                        const teamData: Team = await response.json();
                                        return { ...teamReference, team: teamData.name };
                                    } else {
                                        console.error(`Error fetching team ${teamReference.team}`);
                                        return teamReference;
                                    }
                                })
                            );

                            return { ...game, teams: teamsWithDetails };
                        })
                    );

                    setGames(gamesWithTeams);
                } else {
                    console.error('Error fetching games');
                }
            } catch (error) {
                console.error('An error occurred while fetching games', error);
            }
        }

        fetchGames();
        fetchTeams();
        fetchSeason();
    }, [leagueId, seasonId]);

    const handleTabClick = (tab: 'games' | 'teams') => {
        setActiveTab(tab);
    };

    if (!season) {
        return <div className="text-white text-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
            <div className="text-center mb-4">
                <h1 className="text-6xl font-bold">{`Season Details`}</h1>
                <p className="mt-2 text-xl">
                    {`Start Date: ${formatDate(season.start_date)} - End Date: ${formatDate(season.end_date)}`}
                </p>
            </div>

            <div className="flex gap-4 mb-4">
                <button
                    className={`px-6 py-3 ${activeTab === 'teams' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-500 text-white font-semibold rounded-lg`}
                    onClick={() => handleTabClick('teams')}
                >
                    Teams
                </button>
                <button
                    className={`px-6 py-3 ${activeTab === 'games' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-500 text-white font-semibold rounded-lg`}
                    onClick={() => handleTabClick('games')}
                >
                    Games
                </button>
            </div>

            {activeTab === 'games' && (
                <table className="table-auto w-10/12 mt-3 border border-gray-300 border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-white border-b border-gray-300">
                            <th className="w-1/4 p-2 border-r border-gray-300">Game</th>
                            <th className="w-1/4 p-2 border-r border-gray-300">Date</th>
                            <th className="w-1/4 p-2 border-r border-gray-300">Time</th>
                            <th className="w-1/4 p-2 border-r border-gray-300">Result</th>
                            <th className="w-1/4 p-2 border-r border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game._id} className="border-b border-gray-300 hover:bg-gray-800">
                                {game.teams.length === 2 ? (
                                    <td className="w-1/5 text-center p-2 border-r border-gray-300">{`${game.teams[0].team} vs ${game.teams[1].team}`}</td> // Needs to be game.teams[0].team.name team is not populated
                                ) : <td className="w-1/5 text-center p-2 border-r border-gray-300"></td>}
                                <td className="w-1/5 text-center p-2 border-r border-gray-300">{formatDate(game.date)}</td>
                                <td className="w-1/5 text-center p-2 border-r border-gray-300">{game.time}</td>
                                {game.teams.length === 2 ? (
                                    <td className="w-1/5 text-center p-2 border-r border-gray-300">{`${game.teams[0].score} - ${game.teams[1].score}`}</td>
                                ) : <td className="w-1/5 text-center p-2 border-r border-gray-300"> 0 - 0</td>
                                }
                                <td className="w-1/5 text-center p-2 border-r border-gray-300">
                                    <button
                                        className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg"
                                        onClick={() => router.push(`/leagues/${leagueId}/season/${seasonId}/game/${game._id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {activeTab === 'teams' && (
                <table className="table-auto w-10/12 mt-3 border border-gray-300 border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-white border-b border-gray-300">
                            <th className="w-1/3 p-2 border-r border-gray-300">Team Name</th>
                            <th className="w-1/3 p-2 border-r border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <tr key={team._id} className="border-b border-gray-300 hover:bg-gray-800">
                                <td className="w-1/5 text-center p-2 border-r border-gray-300">{team.name}</td>
                                <td className="w-1/5 text-center p-2 border-r border-gray-300">
                                    <button
                                        className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg"
                                        onClick={() => router.push(`/leagues/${leagueId}/season/${seasonId}/team/${team._id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {activeTab === 'teams' && <div className="absolute bottom-4 right-4">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={handleOpen}>
                    Add Team
                </button>
                <AddTeamModal open={open} handleClose={handleClose} leagueId={leagueId as string} seasonId={seasonId as string} />
            </div>}
            {activeTab === 'games' && <div className="absolute bottom-4 right-4">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={handleOpen}>
                    Add Game
                </button>
                <AddGameModal open={open} handleClose={handleClose} teams={teams} leagueId={leagueId as string} seasonId={seasonId as string} />

            </div>}
        </div>
    );
}
