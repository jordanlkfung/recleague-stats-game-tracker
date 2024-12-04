'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Season {
  _id: string;
  start_date: string;
  end_date: string;
  teams: string[];
  games: string[];
}

interface Game {
  _id: string;
  team1: string;
  team2: string;
  date: string;
  result: string;
}

interface Team {
  _id: string;
  name: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US'); // Formats as MM/DD/YYYY
};

export default function SeasonDetails() {
    const router = useRouter();
    const { leagueId, seasonId } = useParams();
    const [season, setSeason] = useState<Season | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [activeTab, setActiveTab] = useState<'games' | 'teams'>('teams'); // To toggle between games and teams

    useEffect(() => {
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
                    console.error('Error fetching league by ID');
                }
            } catch (error) {
                console.error('An error occurred while fetching managers', error);
            }
        }
        // Dummy data for season details
        const dummySeason: Season = {
        _id: '674fe27b4485f216c24a0327',
        start_date: '2022-10-21T00:00:00.000Z',
        end_date: '2023-04-12T00:00:00.000Z',
        teams: ['Team A', 'Team B', 'Team C'],
        games: ['game1', 'game2', 'game3'],
        };

        const dummyGames: Game[] = [
        { _id: 'game1', team1: 'Team A', team2: 'Team B', date: '2022-10-22', result: '2-1' },
        { _id: 'game2', team1: 'Team B', team2: 'Team C', date: '2022-10-23', result: '0-3' },
        { _id: 'game3', team1: 'Team A', team2: 'Team C', date: '2022-10-24', result: '1-1' },
        ];

        const dummyTeams: Team[] = [
        { _id: 'team1', name: 'Team A' },
        { _id: 'team2', name: 'Team B' },
        { _id: 'team3', name: 'Team C' },
        ];

        // Simulate fetching data
        setSeason(dummySeason);
        setGames(dummyGames);
        setTeams(dummyTeams);
    }, []);

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
                <th className="w-1/4 p-2 border-r border-gray-300">Result</th>
                <th className="w-1/4 p-2 border-r border-gray-300">Actions</th>
                </tr>
            </thead>
            <tbody>
                {games.map((game) => (
                <tr key={game._id} className="border-b border-gray-300 hover:bg-gray-800">
                    <td className="w-1/5 text-center p-2 border-r border-gray-300">{`${game.team1} vs ${game.team2}`}</td>
                    <td className="w-1/5 text-center p-2 border-r border-gray-300">{formatDate(game.date)}</td>
                    <td className="w-1/5 text-center p-2 border-r border-gray-300">{game.result}</td>
                    <td className="w-1/5 text-center p-2 border-r border-gray-300">
                    <button
                        className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg"
                        onClick={() => alert(`Viewing stats for ${game.date}`)} 
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
                        onClick={() => alert(`Viewing ${team.name}`)} 
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
