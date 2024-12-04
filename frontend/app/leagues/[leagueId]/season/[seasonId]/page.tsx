'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function SeasonDetails() {
    const router = useRouter();
    const { leagueId, seasonId } = useParams();
    const [season, setSeason] = useState<Season>();
    const [games, setGames] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [modelOpen, setModelOpen] = useState(false);
    const openModal = () => setModelOpen(true);
    const closeModal = () => setModelOpen(false);
    const [activeTab, setActiveTab] = useState<'games' | 'teams'>('teams'); // To toggle between games and teams

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

    interface ModalProps {
        isOpen: boolean;
        onClose: () => void;
    }
    const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
        const [name, setName] = useState("");
        const [date, setDate] = useState('');
        const [time, setTime] = useState('');
        const [team1, setTeam1] = useState<string>('');
        const [team2, setTeam2] = useState<string>('');
        const [errorMsg, setErrorMsg] = useState("");


        const createTeam = async () => {

            const response = await fetch(`/api/leagues/${leagueId}/season/${seasonId}/team`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            },);


            if (!response.ok) {
                throw Error("");
            }
        }
        
        const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        }
        

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
            setTeam1(event.target.value);
        };
        
        const handleTeam2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setTeam2(event.target.value);
        };
        

        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl w-1/3 flex items-center justify-center">
                    {activeTab === 'teams' ? (
                        <form className="grid grid-rows-1 gap-2">
                            <label htmlFor="name" className="mb-0 text-blue-400">Team Name</label>
                            <input
                                type="text"
                                className="rounded-md text-black p-3 w-full border-blue-500 outline-1 border-2"
                                name="name"
                                id="name"
                                value={name}
                                onChange={handleNameChange}
                                required
                            />




                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    className="bg-red-700 text-white px-4 py-2 rounded-lg w-1/2"
                                    onClick={onClose}>
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg w-1/2"
                                    onClick={createTeam}>
                                    Create
                                </button>
                            </div>
                            {errorMsg && <div className="text-red-500 p-0 mb-0">{errorMsg}</div>}
                        </form>
                    ) : (
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
                            value={team1}
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
                            value={team2}
                            onChange={handleTeam2Change}
                            required
                            className="rounded-md text-black p-3 w-full border-blue-500 outline-1 border-2"
                        >
                            <option value="">Select Team</option>
                            {teams
                                .filter((team) => team._id !== team1)
                                .map((team) => (
                                    <option key={team._id} value={team._id}>
                                        {team.name}
                                    </option>
                                ))}
                        </select>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="bg-red-700 text-white px-4 py-2 rounded-lg w-1/2"
                                onClick={onClose}>
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
                    )}
                </div>
            </div>
        );

    }

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
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={openModal}>
                    Add Team
                </button>
                <Modal isOpen={modelOpen} onClose={closeModal} />

            </div>}
            {activeTab === 'games' && <div className="absolute bottom-4 right-4">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={openModal}>
                    Add Game
                </button>
                <Modal isOpen={modelOpen} onClose={closeModal} />

            </div>}
        </div>
    );
}
