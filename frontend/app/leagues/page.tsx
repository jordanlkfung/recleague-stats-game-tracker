"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface League {
  _id: string,
  name: string,
  sport: string,
  seasons: Season[],
  managers: string[]
}

interface Season {
  start_date: string,
  end_date: string,
  teams: string[],
  games: string[]
}

const LeaugeView = (leagues: League[]) => {
  const router = useRouter();

  return (

    <table className='table-auto w-10/12 mt-3 border border-gray-300 border-collapse'>
      <thead>
        <tr className='bg-gray-700 text-white border-b border-gray-300'>
          <th className='w-1/12 p-2 border-r border-gray-300'>League Name</th>
          <th className='w-1/12 p-2 border-r border-gray-300'>Sport</th>
          <th className='w-1/12 p-2 border-r border-gray-300'>Seasons</th>
          <th className='w-1/12 p-2 border-r border-gray-300'></th>
        </tr>
      </thead>
      {leagues.map((league) => {
        return (
          <tbody key={league._id}>
            <tr className='border-b border-gray-300 hover:bg-gray-800'>
              <td className='w-1/5 text-center p-2 border-r border-gray-300'>{league.name}</td>
              <td className='w-1/5 text-center p-2 border-r border-gray-300'>{league.sport}</td>
              <td className='w-1/5 text-center p-2 border-r border-gray-300'>{league.seasons.length}</td>
              <td className="w-1/5 text-center p-2">
                <button
                  className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg"
                  onClick={() => router.push(`/leagues/${league._id}`)}
                >
                  View
                </button>
              </td>
            </tr>

          </tbody>
        )
      })}
    </table>
  )
}


export default function League() {
  const [userID, setUserID] = useState("");
  const [leagues, setAllLeagues] = useState([]);
  const [userLeagues, setUserLeagues] = useState([]);
  const [view, setView] = useState("All Leagues");

  useEffect(() => {
    const fetchAllLeagues = async () => {
      try {
        const response = await fetch('api/leagues', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setAllLeagues(data);
        }
        else {
          //ERROR
          console.log("error fetch all leagues")
        }
      }
      catch (e) {
        console.error("An error occurred while fetching all leagues:", e);
      }
    }
    const fetchUserLeagues = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const result = JSON.parse(storedUser);
          setUserID(result._id);
        }

        if (userID !== null && userID !== "") {
          const response = await fetch(`/api/users/leagues?id=${userID}`, {
            method: "GET", 
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user leagues");
          }

          const data = await response.json();
          console.log(data)
          setUserLeagues(data);
        } 
      }
      catch (e) {
        console.error("An error occurred while fetching user leagues:", e);
      }
    }
    fetchAllLeagues();
    fetchUserLeagues();
  }, [userID]);
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
    {view === "All Leagues" ? LeaugeView(leagues) : LeaugeView(userLeagues)}
    <div className="absolute bottom-4 right-4">
      <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition">
        Create New League
      </button>
    </div>
  </div>
}