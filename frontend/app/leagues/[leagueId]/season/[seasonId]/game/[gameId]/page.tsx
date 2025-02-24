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

interface Player {
  _id: string,
  name: string,
  position: string,
}

interface Team {
  _id: string;
  name: string;
  roster: Player[];
}

interface TeamStats {
  name: string,
  player: string,
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

interface User {
  _id: string,
  email: string,
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US'); // Formats as MM/DD/YYYY
};

export default function GameDetails() {
  const { leagueId, gameId } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [teams, setTeams] = useState<(Team | null)[]>([null, null]);
  const [t1Stats, setT1Stats] = useState<TeamStats[]>([]);
  const [t2Stats, setT2Stats] = useState<TeamStats[]>([]);

  const [userID, setUserID] = useState("");
  const [managers, setManagers] = useState<User[]>([]);
  const [isManager, setIsManager] = useState<boolean>(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [players, setPlayers] = useState<TeamStats[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        const result = JSON.parse(storedUser);
        setUserID(result._id);
    }

    const fetchManagers = async () => {
      try {
          const response = await fetch(`/api/leagues/${leagueId}/manager`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (response.ok) {
              const data: User[] = await response.json();
              setManagers(data);
          } else {
              console.error('Error fetching league by ID');
          }
      } catch (error) {
          console.error('An error occurred while fetching managers', error);
      }
  }

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

    fetchManagers();
    fetchGame();
  }, [gameId, leagueId]);

  useEffect(() => {
    if (game && teams[0] && teams[0].roster) {
      teams[0].roster.map((player) => {
        game.stat.map((statPlayer) => {
          if (player._id === statPlayer.player) {
            const newObj = { name: player.name, ... statPlayer }
            const p1Exists = t1Stats.some((stat) => {
              return stat.player === statPlayer.player;
            });
            
            if (!p1Exists) setT1Stats((prevStats) => [...prevStats, newObj]);
          }
        });
      });
    }

    if (game && teams[1] && teams[1].roster) {
      teams[1].roster.map((player) => {
        game.stat.map((statPlayer) => {
          if (player._id === statPlayer.player) {
            const newObj = { name: player.name, ... statPlayer }
            const p2Exists = t2Stats.some((stat) => {
              return stat.player === statPlayer.player;
            });
            if (!p2Exists) setT2Stats((prevStats) => [...prevStats, newObj]);
          }
        });
      });
    }

    if (!isManager && userID !== "" && managers.length > 0) {
      const isUserManager = (userID: string, managers: User[]) => {
          return managers.some(manager => manager._id === userID);
      };

      setIsManager(isUserManager(userID, managers));
    }
  }, [game, isManager, managers, teams, userID]);

  useEffect(() => {
    if (selectedTeam) {
      if (teams[0] && teams[1]) {
          if (selectedTeam === teams[0].name && t1Stats) {
            setPlayers(t1Stats);
          } 
          else if (selectedTeam === teams[1].name && t2Stats) {
            setPlayers(t2Stats);
          }
      }
    }
  }, [selectedTeam, t1Stats, t2Stats, teams]);

  console.log(t1Stats)

  const handleGameStat = async () => {
    
  };

  if (selectedTeam !== "") console.log(players)
  
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

      {/* Using flex-col for stacking tables vertically */}
      <div className="flex flex-col items-center space-y-8 w-full">
        {/* Team 1 Table */}
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-semibold text-center">{teams[0]?.name}</h2>
          <table className="table-auto mt-3 border border-gray-300 border-collapse w-full">
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
              {t1Stats.length > 0 ? (
                t1Stats.map((player, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-800">
                    <td className="text-center p-2 border-r border-gray-300">{player.name}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.min}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.fgm}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.fga}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.threeptm}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.threeptsa}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.ftm}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.fta}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.rebounds}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.assists}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.blocks}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.steals}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.pf}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.to}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={15} className="text-center p-2">No stats available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Team 2 Table */}
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-semibold text-center">{teams[1]?.name}</h2>
          <table className="table-auto mt-3 border border-gray-300 border-collapse w-full">
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
              {t2Stats.length > 0 ? (
                t2Stats.map((player, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-800">
                    <td className="text-center p-2 border-r border-gray-300">{player.player}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.min}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.fgm}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.fga}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.threeptm}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.threeptsa}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.ftm}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.fta}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.rebounds}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.assists}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.blocks}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.steals}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.pf}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.to}</td>
                    <td className="text-center p-2 border-r border-gray-300">{player.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={15} className="text-center p-2">No stats available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Game Stat Update</h2>
            <p className="mb-4">Select a team to update the game stat:</p>
            
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              <option value="" disabled>
                Select a team
              </option>
              {teams.map((team, index) =>
                team ? ( 
                  <option key={index} value={team.name}>
                    {team.name}
                  </option>
                ) : null 
              )}
            </select>

            {selectedTeam && players.length > 0 && (
            <>
              <p className="mb-4">Select a player to update the game stat:</p>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
              >
                <option value="" disabled>
                  Select a player
                </option>
                {players.map((player, index) => (
                  <option key={index} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </select>
            </>
          )}

            <button
              onClick={handleGameStat}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              disabled={!selectedTeam} 
            >
              Submit
            </button>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {userID !== null && userID !== "" && isManager ? (
        <div className="absolute bottom-4 right-4 flex gap-4">
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition"
            onClick={() => setIsPopupOpen(true)}
          >
            Edit
          </button>
        </div>
      ) : null} 
    </div>
  );
}
