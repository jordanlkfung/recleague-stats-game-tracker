'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BasketballStat {
  player: string;
  min: number;
  fgm: number;
  fga: number;
  threeptm: number;
  threeptsa: number;
  ftm: number;
  fta: number;
  rebounds: number;
  assists: number;
  blocks: number;
  steals: number;
  pf: number;
  to: number;
  points: number;
}

interface Game {
  _id: string;
  date: string;
  time: string;
  teams: { team: string; score: number }[];
  stat: BasketballStat[];
}

interface Team {
  _id: string;
  name: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US'); // Formats as MM/DD/YYYY
};

export default function GameDetails() {
  const { gameId } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [teams, setTeams] = useState<(Team | null)[]>([null, null]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data: Game = await response.json();
          setGame(data);

          // Fetch team data based on team IDs
          const teamPromises = data.teams.map((team) =>
            fetch(`/api/teams/${team.team}`)
              .then((res) => res.json())
              .catch((error) => {
                console.error(`Error fetching team ${team.team}:`, error);
                return null;
              })
          );

          const fetchedTeams = await Promise.all(teamPromises);
          setTeams(fetchedTeams);
        } else {
          console.error('Error fetching game by ID');
        }
      } catch (error) {
        console.error('An error occurred while fetching game by ID', error);
      }
    };

    fetchGame();
  }, [gameId]);

  console.log(game);

  if (!game) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
      <div className="text-center mb-4">
        {teams[0] && teams[1] ? (
          <>
            <h1 className="text-6xl font-bold">{`${teams[0]?.name} vs ${teams[1]?.name}`}</h1>
            <p className="mt-2 text-xl">{`${formatDate(game.date)} - ${game.time}`}</p>
            <p className="text-xl mt-2">{`${game.teams[0].score} - ${game.teams[1].score}`}</p>
          </>
        ) : (
          <p className="text-xl mt-2">Fetching team details...</p>
        )}
      </div>

      <table className="table-auto mt-3 border border-gray-300 border-collapse w-auto">
        <thead>
          <tr className="bg-gray-700 text-white border-b border-gray-300">
            <th className="p-2 border-r border-gray-300">Player</th>
            <th className="p-2 border-r border-gray-300">Minutes</th>
            <th className="p-2 border-r border-gray-300">FGM</th>
            <th className="p-2 border-r border-gray-300">FGA</th>
            <th className="p-2 border-r border-gray-300">3PM</th>
            <th className="p-2 border-r border-gray-300">3PA</th>
            <th className="p-2 border-r border-gray-300">FTM</th>
            <th className="p-2 border-r border-gray-300">FTA</th>
            <th className="p-2 border-r border-gray-300">REB</th>
            <th className="p-2 border-r border-gray-300">AST</th>
            <th className="p-2 border-r border-gray-300">BLK</th>
            <th className="p-2 border-r border-gray-300">STL</th>
            <th className="p-2 border-r border-gray-300">PF</th>
            <th className="p-2 border-r border-gray-300">TO</th>
            <th className="p-2 border-r border-gray-300">PTS</th>
          </tr>
        </thead>
        <tbody>
          {game.stat !== null && game.stat.length > 0 ? (
            game.stat.map((stat, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-800">
                <td className="text-center p-2 border-r border-gray-300">{stat.player}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.min}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.fgm}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.fga}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.threeptm}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.threeptsa}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.ftm}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.fta}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.rebounds}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.assists}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.blocks}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.steals}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.pf}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.to}</td>
                <td className="text-center p-2 border-r border-gray-300">{stat.points}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={15} className="text-center p-2">
                No stats available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
