'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface team {
    _id: string,
    name: string,
}
interface roster {
    _id: string,
    name: string,
    birthday: Date,
    sex: string,
    height: {
        feet: number,
        inches: number
    },
    weight: number,
    position: string
}
interface Game {
    _id: string;
    teams: [{
        team: string,
        score: number
    }, {
        team: string,
        score: number
    }],
    date: string;
    result: {
        winner: string | null,
        loser: string | null,
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
        const response = await fetch(`api/teams/${teamId}`, {
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
        const response = await fetch(`api/teams/${teamId}/roster`, {
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
        const gameData: Game[] = [
            {
                _id: "game1",
                teams: [
                    { team: "Team A", score: 3 },
                    { team: "Team B", score: 1 }
                ],
                date: "2024-12-01",
                result: {
                    winner: "Team A",
                    loser: "Team B",
                    tie: false
                }
            },
            {
                _id: "game2",
                teams: [
                    { team: "Team C", score: 2 },
                    { team: "Team D", score: 2 }
                ],
                date: "2024-12-02",
                result: {
                    winner: "",
                    loser: "",
                    tie: true
                }
            },
            {
                _id: "game3",
                teams: [
                    { team: "Team E", score: 5 },
                    { team: "Team F", score: 3 }
                ],
                date: "2024-12-03",
                result: {
                    winner: "Team E",
                    loser: "Team F",
                    tie: false
                }
            }
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
        const team: team = {
            _id: "test",
            name: "team1",
        }
        // setRoster(rosterData);
        fetchRoster();
        setGames(gameData);
        setTeam(
            team
        )
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
    const displayResult = (game: Game) => {
        const result = game.result.tie ? <span>T </span> : (game.result.winner === team?._id ? <span className="text-green-500">W </span> : <span className="text-red-500">L </span>);
        const score: string = game.teams[0].team === team?._id ? `${game.teams[0].score.toString()} - ${game.teams[1].score.toString()}` : `${game.teams[1].score} - ${game.teams[0].score.toString()}`;
        return <td className="w-1/5 text-center p-2 border-r border-gray-300">
            {result}
            <span>{score}</span>
        </td>

    }
    const gamesView = () => {
        return (
            <table className="table-auto w-10/12 mt-3 border border-gray-300 border-collapse">
                <thead>
                    <tr className="bg-gray-700 text-white border-b border-gray-300">
                        <th className="w-1/4 p-2 border-r border-gray-300">Opponent</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Date</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Result</th>
                        <th className="w-1/4 p-2 border-r border-gray-300">Stats</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game._id} className="border-b border-gray-300 hover:bg-gray-800">
                            <td className="w-1/5 text-center p-2 border-r border-gray-300">{game.teams[0].team == team!.name ? game.teams[0].team : game.teams[1].team}</td>
                            <td className="w-1/5 text-center p-2 border-r border-gray-300">{formatDate(game.date)}</td>
                            {displayResult(game)}
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