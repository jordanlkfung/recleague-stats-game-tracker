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
    birthdate: string,
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
    console.log(dateString);
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Formats as MM/DD/YYYY
};

export default function TeamView() {
    const { leagueId, seasonId, teamId } = useParams();
    const [gameView, setGameView] = useState(false)
    const [team, setTeam] = useState<team | null>(null);
    const [roster, setRoster] = useState<roster[] | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [modelOpen, setModelOpen] = useState(false);

    const openModal = () => setModelOpen(true);
    const closeModal = () => setModelOpen(false);

    const fetchTeam = async () => {
        const response = await fetch(`/api/teams/${teamId}`, {
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
        const response = await fetch(`/api/teams/${teamId}/roster`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(response);
        if (!response.ok)
            throw Error("error fetching roster");
        const data: roster[] = await response.json();
        console.log(data);
        setRoster(data);
    }
    const fetchGames = async () => {
        const response = await fetch(`/api/teams/${teamId}/games`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
        if (!response.ok)
            throw Error("Error fetching games");
        console.log(response);
        const data: Game[] = await response.json();
        console.log(data)
        setGames(data);
    }

    useEffect(() => {
        fetchTeam();
        fetchRoster();
        fetchGames();
    }, [])

    interface height {
        feet: number,
        inches: number
    }
    interface ModalProps {
        isOpen: boolean;
        onClose: () => void;
    }
    const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
        const [name, setName] = useState("");
        const [sex, setSex] = useState<'Male' | 'Female'>('Male');
        const [position, setPosition] = useState<'PG' | 'SG' | 'SF' | 'PF' | 'C'>('PG');
        const [weight, setWeight] = useState("");
        const [inches, setInches] = useState("");
        const [feet, setFeet] = useState('');
        const [birthdate, setBirthdate] = useState("");
        const [errorMsg, setErrorMsg] = useState("");
        const handleBirthdateChange = (event: React.ChangeEvent<HTMLInputElement>) => setBirthdate(event.target.value); // Handle birthdate input change


        const createPlayer = async () => {

            const response = await fetch(`/api/teams/${teamId}/roster`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, sex, position, weight, height: { inches, feet }, birthdate })
            },);


            if (!response.ok) {
                throw Error("");
            }
        }
        const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        }
        const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => setWeight(event.target.value);
        const handleFeetChange = (event: React.ChangeEvent<HTMLInputElement>) => setFeet(event.target.value);
        const handleInchesChange = (event: React.ChangeEvent<HTMLInputElement>) => setInches(event.target.value);
        const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => setPosition(event.target.value as 'PG' | 'SG' | 'SF' | 'PF' | 'C');

        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl w-1/3 flex items-center justify-center">
                    <form className="grid grid-rows-1 gap-2">
                        <label htmlFor="name" className="mb-0 text-blue-400">Name</label>
                        <input
                            type="text"
                            className="rounded-md text-black p-3 w-full border-blue-500 outline-1 border-2"
                            name="name"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            required
                        />
                        <div>
                            <label htmlFor="position" className="block text-blue-400">Position</label>
                            <select
                                id="position"
                                value={position}
                                onChange={handlePositionChange}
                                className="w-full p-3 border-2 border-blue-500 rounded-md outline-none focus:ring-2 focus:ring-blue-400 text-black"
                            >
                                <option value="PG">Point Guard (PG)</option>
                                <option value="SG">Shooting Guard (SG)</option>
                                <option value="SF">Small Forward (SF)</option>
                                <option value="PF">Power Forward (PF)</option>
                                <option value="C">Center (C)</option>
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="feet" className="block text-blue-400">Feet</label>
                                <input
                                    type="number"
                                    id="feet"
                                    value={feet}
                                    onChange={handleFeetChange}
                                    className="w-full p-3 border-2 border-blue-500 rounded-md outline-none focus:ring-2 text-black focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="inches" className="block text-blue-400">Inches</label>
                                <input
                                    type="number"
                                    id="inches"
                                    value={inches}
                                    onChange={handleInchesChange}
                                    className="w-full p-3 border-2 border-blue-500 text-black rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="weight" className="block text-blue-400">Weight (lbs)</label>
                            <input
                                type="number"
                                id="weight"
                                value={weight}
                                onChange={handleWeightChange}
                                className="w-full p-3 border-2 border-blue-500 rounded-md outline-none text-black focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="birthdate" className="block text-blue-400">Birthdate</label>
                            <input
                                type="date"
                                id="birthdate"
                                value={birthdate}
                                onChange={handleBirthdateChange}
                                className="w-full p-3 border-2 border-blue-500 text-black rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <label htmlFor="sex" className="mb-0 text-blue-400">Sex</label>
                        <div className="relative inline-block text-center">
                            <div className="relative group">
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-lg items-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    {sex}
                                </button>

                                <div
                                    className="absolute left-0 w-full mt-1 origin-top-left bg-white divide-y divide-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out"
                                    role="menu"
                                    aria-labelledby="sport-button"
                                >
                                    <div className="py-1 w-full">
                                        <a
                                            href="#"
                                            className="block px-6 py-2 text-lg text-gray-700 hover:bg-gray-200"
                                            onClick={() => setSex("Male")}
                                            role="menuitem"
                                        >
                                            Male
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-200 w-full"
                                            onClick={() => setSex("Female")}
                                            role="menuitem"
                                        >
                                            Female
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="bg-red-700 text-white px-4 py-2 rounded-lg w-1/2"
                                onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-1/2"
                                onClick={createPlayer}>
                                Create
                            </button>
                        </div>
                        {errorMsg && <div className="text-red-500 p-0 mb-0">{errorMsg}</div>}
                    </form>

                </div>
            </div>
        );

    }

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
                            <td className="w-1/4 text-center p-2 border-r border-gray-300">{formatDate(player.birthdate)}</td>
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
                <h1 className="text-6xl font-bold mb-4">{team?.name}</h1>
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
            {!gameView && <div className="absolute bottom-4 right-4">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={openModal}>
                    Add Player
                </button>
                <Modal isOpen={modelOpen} onClose={closeModal} />

            </div>}
        </div>

    )
}
