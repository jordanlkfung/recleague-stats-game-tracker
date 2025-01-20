'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
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
interface player {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    sex: string
}
interface playerPool {
    players: [
        player
    ]
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

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
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

    const fetchPlayerPool = async () => {

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
        // fetchRoster();
        fetchGames();
    }, [])

    const rosterView = () => {
        return (
            <div className="w-10/12">
                <table className="table-auto  mt-3 border border-gray-300 border-collapse">
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
                <div className="absolute bottom-4 right-4">
                    <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={handleOpen}>
                        Add Player
                    </button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        <Box sx={{ ...style, width: 600 }}>
                            <div className="flex flex-wrap justify-center space-y-3">
                                <h2 className="text-center text-xl font-bold w-full">Select Player(s) From Player Pool</h2>
                                {displayPlayerPool()}

                                <button className="rounded-lg px-3 py-2 bg-green-600 justify-self-center self-center w-full" onClick={handleClose}>Add</button>
                            </div>
                        </Box>
                    </Modal>

                </div>
            </div>
        )
    }

    const displayPlayerPool = () => {
        const [numSelected, setNumSelected] = useState(0)
        return (
            <Table>
                <Toolbar>
                    {numSelected > 0 ? (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            {numSelected} selected
                        </Typography>
                    ) : (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Player Pool
                        </Typography>
                    )}
                    {numSelected > 0 ? (
                        <Tooltip title="Delete">
                            <IconButton>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Filter list">
                            <IconButton>
                            </IconButton>
                        </Tooltip>
                    )}
                </Toolbar>

            </Table>
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

        </div>

    )
}
