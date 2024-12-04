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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [sport, setSport] = useState<string>("Select Sport");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>('');
  const router = useRouter();

  const handleLeagueNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const handleCreateLeague = async () => {
    if (sport === "Select sport") {
      setErrorMsg("Please Select a sport");
      return
    }

    if (name.length < 3) {
      setErrorMsg("Name has to be at least 3 characters")
      return
    }

    const response = await fetch('api/leagues', { method: 'POST' },);
    if (!response.ok) {
      setErrorMsg("Error occurred while create league, please try again");
      return
    }

    const league = response.json();

    //GET id and push to [leagueId]
    router.push(`leagues/${league}`);
  }
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-1/3 flex items-center justify-center">
        <form className="grid grid-rows-1 gap-2">
          <label htmlFor="name" className="mb-0 text-blue-400">Name</label>
          <input
            type="text"
            className="rounded-md text-black p-3 w-80 border-blue-500 outline-1 border-2"
            name="name"
            id="name"
            value={name}
            onChange={handleLeagueNameChange}
            required
          />
          <label htmlFor="sport" className="mb-0 text-blue-400">Sport</label>
          {/* <select name="sport" className="border-2 border-blue-500 rounded-md p-3 w-80 text-black">
            <option value="Basketball">Basketball</option>
            <option value="Football">Football</option>
          </select> */}
          <div className="relative inline-block text-center">
            <div className="relative group">
              <button
                type="button"
                className="inline-flex justify-center rounded-lg items-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {sport}
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
                    onClick={() => setSport("Basketball")}
                    role="menuitem"
                  >
                    Basketball
                  </a>
                  <a
                    href="#"
                    className="block px-6 py-3 text-lg text-gray-700 hover:bg-gray-200 w-full"
                    onClick={() => setSport("Football")}
                    role="menuitem"
                  >
                    Football
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
              onClick={handleCreateLeague}>
              Create
            </button>
          </div>
          {errorMsg && <div className="text-red-500 p-0 mb-0">{errorMsg}</div>}
        </form>

      </div>
    </div>
  );


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
      {leagues.map((league, index) => {
        return (
          <tbody key={index}>
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
  const [modelOpen, setModelOpen] = useState(false);

  const openModal = () => setModelOpen(true);
  const closeModal = () => setModelOpen(false);
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
      <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={openModal}>
        Create New League
      </button>
      <Modal isOpen={modelOpen} onClose={closeModal} />

    </div>
  </div>
}