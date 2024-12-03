'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface League {
  _id: String,
  name: String,
  sport: String,
  seasons: Season[],
  managers: String[]
}

interface Season {
  start_date: String,
  end_date: String,
  teams: String[],
  games: String[]
}
const leaugeView = (leagues: League[]) => {
  const router = useRouter();

  return (

    <table className='table table-fixed w-11/12 mt-3 border-seperate border border-spacing-2'>
      <thead>
        <tr className='flex space-x-4 border border-spacing-2'>
          <th className='w-1/5 text-center self-center'>League Name</th>
          <th className='w-1/5 text-center self-center'>Sport</th>
          <th className='w-1/6 text-center self-center'>Season Start Date</th>
          <th className='w-1/5 text-center self-center'>Manager</th>
          <th className='w-1/12 text-center self-center'>Number of Teams</th>
          <th className='w-1/5 text-center self-center'></th>
        </tr>
      </thead>
      {leagues.map((league) => {
        return (
          <tbody>
            <tr className='flex space-x-4 border border-spcaing-2'>
              <td className='w-1/5 text-center self-center'>{league.name}</td>
              <td className='w-1/5 text-center self-center'>{league.sport}</td>
              <td className='w-1/6 text-center self-center'>{league.seasons[0].start_date}</td>
              <td className='w-1/5 text-center self-center'>{league.managers[0]}</td>
              <td className='w-1/12 text-center self-center'>4</td>
              {/** change join to view if user is already in league */}
              <th className='w-1/5 text-center'><button className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg my-1" onClick={() => router.push(`/leagues/${league._id}`)}>View</button></th>
            </tr>

          </tbody>
        )
      })}
    </table>
  )
}


export default function League() {
  const exampleLeague: League = {
    _id: "1234567890abcdef",
    name: "Premier League",
    sport: "Football",
    seasons: [
      {
        start_date: "2023-08-01T00:00:00Z",
        end_date: "2024-05-31T23:59:59Z",
        teams: ["Team A", "Team B", "Team C"],
        games: ["game1", "game2", "game3"]
      },
      {
        start_date: "2024-08-01T00:00:00Z",
        end_date: "2025-05-31T23:59:59Z",
        teams: ["Team D", "Team E", "Team F"],
        games: ["game4", "game5", "game6"]
      }
    ],
    managers: ["Manager A", "Manager B"]
  };

  const [leagues, setAllLeagues] = useState([{
    _id: "tempID",
    name: "test",
    sport: "basketball",
    seasons: [{
      start_date: "2024-12-02", end_date: "2024-12-31", games: ["test"],
      teams: ["test"]
    }],
    managers: ["test"]
  }, exampleLeague]);
  const [userLeagues, setUserLeagues] = useState([]);
  const [view, setView] = useState("All Leagues");

  useEffect(() => {
    const fetchAllLeagues = async () => {
      try {
        const response = await fetch('api/leagues', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setAllLeagues(data);
        }
        else {
          //ERROR
          console.log("error fetch all nc")
        }
      }
      catch (e) {

      }
    }
    const fetchUserLeagues = async () => {
      try {
        const response = await fetch(`api/user`, {
          method: 'GET',
        });
        if (!response.ok) {
          //ERROR
        }
        console.log(response)
        const data = await response.json();
        setUserLeagues(data)
      }
      catch (e) {

      }
    }
    fetchAllLeagues();
  }, []);
  return <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">Leagues</h1>
    </div>
    <div className="flex gap-6">
      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition" onClick={() => setView("All Leagues")}>
        View All Leagues
      </button>
      <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={() => setView("User Leagues")}>
        View My Leagues
      </button>
    </div>
    {view === "All Leagues" ? leaugeView(leagues) : leaugeView(userLeagues)}
    <div className="absolute bottom-4 right-4">
      <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition">
        Create New League
      </button>
    </div>
  </div>
}