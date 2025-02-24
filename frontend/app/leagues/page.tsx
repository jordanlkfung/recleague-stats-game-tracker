"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputLabel from '@mui/material/InputLabel';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';


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

interface createLeagueModalProps {
  handleClose: () => void,
  userID: string,
  isOpen: boolean

}

const CreateLeagueModal: React.FC<createLeagueModalProps> = ({ handleClose, userID, isOpen }) => {

  const [sport, setSport] = useState<string>("Select Sport");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleCreateLeague = async () => {
    if (sport === "Select sport") {
      setErrorMsg("Please Select a sport");
      return
    }

    if (name.length < 3) {
      setErrorMsg("Name has to be at least 3 characters")
      return
    }

    const response = await fetch('api/leagues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, sport, manager: userID })
    },);

    if (!response.ok) {
      setErrorMsg("Error occurred while create league, please try again");
    }
    else {
      handleClose();
    }
  }
  const handleLeagueNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const handleSportChange = (event: SelectChangeEvent) => {
    setSport(event.target.value);
  };
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl w-1/3 flex items-center justify-center">
          <form className="grid grid-rows-1 gap-4 w-2/3" onSubmit={handleCreateLeague}>

            <TextField variant="outlined" onChange={handleLeagueNameChange} value={name} required className="w-full m-2" label="League Name" />

            <FormControl className="w-full mt-2">
              <InputLabel id="select-sport-label">Select Sport</InputLabel>

              <Select
                value={sport}
                onChange={handleSportChange}
                displayEmpty
                label="Select Sport"
                labelId="select-sport-label"
              >
                <MenuItem value="Basketball">Basketball</MenuItem>
                <MenuItem value="Football">Football</MenuItem>
              </Select>
              <FormHelperText className="text-red">{errorMsg}</FormHelperText>
            </FormControl>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-red-700 text-white px-4 py-2 rounded-lg w-1/2"
                onClick={handleClose}>
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-1/2"
                type="submit">
                Create
              </button>
            </div>
            {errorMsg && <div className="text-red-500 p-0 mb-0">{errorMsg}</div>}
          </form>

        </div>
      </div>
    </Modal>
  )
}

const LeaugeView = (leagues: League[]) => {
  const router = useRouter();

  return (

    <table className='table-auto w-10/12 mt-3 border border-gray-300 border-collapse'>
      <thead>
        <tr className='bg-gray-700 text-white border-b border-gray-300'>
          <th className='w-1/6 p-2 border-r border-gray-300'>League Name</th>
          <th className='w-1/6 p-2 border-r border-gray-300'>Sport</th>
          <th className='w-1/6 p-2 border-r border-gray-300'>Seasons</th>
          <th className='w-1/12 p-2 border-r border-gray-300'>Actions</th>
        </tr>
      </thead>
      {leagues.map((league, index) => {
        return (
          <tbody key={index}>
            <tr className='border-b border-gray-300 hover:bg-gray-800'>
              <td className='w-1/6 text-center p-2 border-r border-gray-300'>{league.name}</td>
              <td className='w-1/6 text-center p-2 border-r border-gray-300'>{league.sport}</td>
              <td className='w-1/6 text-center p-2 border-r border-gray-300'>{league.seasons.length}</td>
              <td className="w-1/12 text-center p-2">
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
  const [userID, setUserID] = useState(null);
  const [leagues, setAllLeagues] = useState([]);
  const [userLeagues, setUserLeagues] = useState([]);
  const [view, setView] = useState("All Leagues");
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
    const fetchUser = async () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const result = JSON.parse(storedUser);
        setUserID(result._id);
      }
    }
    fetchUser();
    fetchAllLeagues();
  }, []);
  useEffect(() => {
    const fetchUserLeagues = async () => {

      if (userID) {
        try {
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
        catch (e) {
          console.error("An error occurred while fetching user leagues:", e);
        }
      }
    }
    fetchUserLeagues();
  }, [userID])



  return <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">Leagues</h1>
    </div>
    {userID && <div className="flex gap-6">
      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition" onClick={() => setView("All Leagues")}>
        View All Leagues
      </button>
      <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={() => setView("User Leagues")}>
        View My Leagues
      </button>
    </div>}
    {view === "All Leagues" ? LeaugeView(leagues) : LeaugeView(userLeagues)}
    {userID && <div className="absolute bottom-4 right-4">
      <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition" onClick={handleOpen}>
        Create New League
      </button>
      <CreateLeagueModal isOpen={open} handleClose={handleClose} userID={userID} />
    </div>
    }
  </div>
}