'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface team {
    _id: string,
    name: string,
    roster: string
}
interface roster {
    _id: string,
    name: string,
    birthday: Date,
    sex: string,
    height: {
        feet: Number,
        inches: Number
    },
    weight: Number,
    position: string
}
interface Game {
    _id: string;
    team1: string;
    team2: string;
    date: string;
    result: {
        winnner: string,
        loser: string,
        tie: boolean
    };
}
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Formats as MM/DD/YYYY
};

export default function TeamView() {
    const { leagueId, seasonId, teamId } = useParams();
    const [gameView, setGameView] = useState(false)
    const [team, setTeam] = useState<team | null>(null);
    const [roster, setRoster] = useState<roster[] | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const fetchTeam = async () => {
        const response = await fetch(`api/team/${teamId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
        );

        if (!response.ok) {
            throw Error("Error fetching team");
        }
        const data: team = await response.json();
        setTeam(data);
    }

    const fetchRoster = async () => {
        const response = await fetch(`api/team/${teamId}/roster`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok)
            throw Error("error fetching roster");

        const data: roster[] = await response.json();
        setRoster(data);
    }
    const fetchGames = async () => {
        const response = await fetch(`api/team/${teamId}/games`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
        if (!response.ok)
            throw Error("Error fetching games");

        const data: Game[] = await response.json();
        setGames(data);
    }

    useEffect(() => {
        const dummyGames: Game[] = [
            { _id: 'game1', team1: 'Team A', team2: 'Team B', date: '2022-10-22', result: '2-1' },
            { _id: 'game2', team1: 'Team B', team2: 'Team C', date: '2022-10-23', result: '0-3' },
            { _id: 'game3', team1: 'Team A', team2: 'Team C', date: '2022-10-24', result: '1-1' },
        ];

        const rosterData: roster[] = [
            {
                _id: "1",
                name: "John Doe",
                birthday: new Date("1990-05-15"),
                sex: "Male",
                height: {
                    feet: 6,
                    inches: 2
                },
                weight: 190,
                position: "Forward"
            },
            {
                _id: "2",
                name: "Jane Smith",
                birthday: new Date("1995-07-30"),
                sex: "Female",
                height: {
                    feet: 5,
                    inches: 8
                },
                weight: 150,
                position: "Midfielder"
            },
            {
                _id: "3",
                name: "Alex Johnson",
                birthday: new Date("1988-11-25"),
                sex: "Male",
                height: {
                    feet: 5,
                    inches: 10
                },
                weight: 180,
                position: "Goalkeeper"
            }
        ];
        setRoster(rosterData);
        setGames(dummyGames);
    }, [])

    const rosterView = () => {
        return (
            <table className="table-auto w-10/12 mt-3 border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-700 text-white border-b border-gray-300">
                        <th className="w-1/4 p-2 border-r border-gray-300">Name</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Position</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Birthday</th>
                        <th className="w-1/6 p-2 border-r border-gray-300">Height</th>
                        <th className="w-1/6 p-2 border-r border-gray-300">Weight</th>
                        <th className="w-1/6 p-2 border-r border-gray-300">Sex</th>
                    </tr>
                </thead>
                <tbody>
                    {roster && roster.map((player) => {
                        return (<tr key={player._id} className="border-b border-gray-300 hover:bg-gray-800">
                            <td className="w-1/4 text-center p-2 border-r border-gray-300">{player.name}</td>
                            <td className="w-1/4 text-center p-2 border-r border-gray-300">{player.position}</td>
                            <td className="w-1/4 text-center p-2 border-r border-gray-300">{formatDate(player.birthday.toString())}</td>
                            <td className="w-1/6 text-center p-2 border-r border-gray-300">{player.height.feet.toString() + "\'" + player.height.inches.toString() + "\""}</td>
                            <td className="w-1/6 text-center p-2 border-r border-gray-300">{player.weight.toString()}</td>
                            <td className="w-1/6 text-center p-2 border-r border-gray-300">{player.sex.toString()}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        )
    }

    const gamesView = () => {
        return (
            <table className="table-auto w-10/12 mt-3 border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-700 text-white border-b border-gray-300">
                        <th className="w-1/4 p-2 border-r border-gray-300">Opponent</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Date</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Result</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game._id} className="border-b border-gray-300 hover:bg-gray-800">
                            <td className="w-1/5 text-center p-2 border-r border-gray-300">{game.team1 == team!.name ? game.team2 : game.team1}</td>
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
        )
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">TEAM NAME</h1>
            </div>
            <div className="flex gap-6">
                <button className={`px-6 py-3 ${!gameView ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition`} onClick={() => setGameView(false)}>
                    Roster
                </button>
                <button className={`px-6 py-3 ${gameView ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition`} onClick={() => setGameView(true)}>
                    Games
                </button>
            </div>
            {gameView ? gamesView() : rosterView()}
        </div>
    )
}