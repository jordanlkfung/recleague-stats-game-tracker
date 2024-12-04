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
                    ): <td className="w-1/5 text-center p-2 border-r border-gray-300"></td>}
                    <td className="w-1/5 text-center p-2 border-r border-gray-300">{formatDate(game.date)}</td>
                    <td className="w-1/5 text-center p-2 border-r border-gray-300">{game.time}</td>
                    {game.teams.length === 2 ? (
                        <td className="w-1/5 text-center p-2 border-r border-gray-300">{`${game.teams[0].score} - ${game.teams[1].score}`}</td>
                    ): <td className="w-1/5 text-center p-2 border-r border-gray-300"> 0 - 0</td>
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
        </div>
    );
}
