'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface League {
    _id: string;
    name: string;
    sport: string;
    seasons: Season[];
    managers: string[];
}

interface Season {
    start_date: string;
    end_date: string;
    teams: string[];
    games: string[];
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Formats as MM/DD/YYYY
};


export default function LeagueID() {
    const router = useRouter();
    const { leagueId } = useParams();
    const [league, setLeague] = useState<League | null>(null);

    useEffect(() => {
        const fetchLeague = async () => {
            try {
                const response = await fetch(`/api/leagues/${leagueId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data: League = await response.json();
                    setLeague(data);
                } else {
                    console.error('Error fetching league by ID');
                }
            } catch (error) {
                console.error('An error occurred while fetching league:', error);
            }
        };

        fetchLeague();
    }, [leagueId]);

    if (!league) {
        return <div className="text-white text-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">{league.name}</h1>
            </div>
            <table className="table-auto w-10/12 mt-3 border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-700 text-white border-b border-gray-300">
                        <th className="w-1/12 p-2 border-r border-gray-300"></th>
                        <th className="w-1/5 text-center p-2 border-r border-gray-300">Season #</th>
                        <th className="w-1/5 text-center p-2 border-r border-gray-300">Start Date</th>
                        <th className="w-1/6 text-center p-2 border-r border-gray-300">End Date</th>
                        <th className="w-1/12 text-center p-2 border-r border-gray-300">Number of Teams</th>
                        <th className="w-1/5 text-center p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {league.seasons.map((season, index) => (
                        <tr key={index} className="border-b border-gray-300 hover:bg-gray-800">
                            <td className="w-1/12 p-2 text-center border-r border-gray-300">
                                <input type="checkbox" />
                            </td>
                            <td className="w-1/5 text-center p-2 border-r border-gray-300">{index + 1}</td>
                            <td className="w-1/5 text-center p-2 border-r border-gray-300">{formatDate(season.start_date)}</td>
                            <td className="w-1/6 text-center p-2 border-r border-gray-300">{formatDate(season.end_date)}</td>
                            <td className="w-1/12 text-center p-2 border-r border-gray-300">{season.teams.length}</td>
                            <td className="w-1/5 text-center p-2">
                                <button
                                    className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg"
                                    onClick={() => router.push(`/leagues/${league._id}`)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="absolute bottom-4 right-4">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition">
                    Create New League
                </button>
            </div>
        </div>
    );
}
