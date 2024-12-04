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

    <table className='table table-fixed w-[40%] mt-3 border-seperate border border-spacing-2'>
      <thead>
        <tr className='flex space-x-4 border border-spacing-2'>
          <th className='w-1/5 text-center self-center'>League Name</th>
          <th className='w-1/5 text-center self-center'>Sport</th>
          <th className='w-1/5 text-center self-center'>Seasons</th>
          <th className='w-1/5 text-center self-center'></th>
        </tr>
      </thead>
      {leagues.map((league) => {
        return (
          <tbody key={league._id}>
            <tr className='flex space-x-4 border border-spcaing-2'>
              <td className='w-1/5 text-center self-center'>{league.name}</td>
              <td className='w-1/5 text-center self-center'>{league.sport}</td>
              <td className='w-1/5 text-center self-center'>{league.seasons.length}</td>
              <th className='w-1/5 text-center'><button className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg my-1" onClick={() => router.push(`/leagues/${league._id}`)}>View</button></th>
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