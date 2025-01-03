'use client'
import { useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

enum Sex {
    Male = "M",
    Female = "F",
    Select = "Select"
}

export default function updatePage() {
    const [userId, setuserID] = useState("");
    const [name, setName] = useState("");
    const [sex, setSex] = useState<Sex>(Sex.Select);
    const [weight, setWeight] = useState("");
    const [feet, setFeet] = useState("");
    const [inches, setInches] = useState("");
    const [height, setHeight] = useState("");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4"></h1>
            </div>

            <form onSubmit={() => { }} className="flex flex-col gap-6 w-96 bg-gray-800 p-6 rounded-lg">
                <div>
                    <label className="text-lg">First Name</label>
                    <input
                        type="text"
                        className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="text-lg">Last Name</label>
                    <input
                        type="text"
                        className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="text-lg">Height</label>

                    <div className="grid grid-cols-2 gap-2">

                        <div>
                            <input
                                type="text"
                                className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                                placeholder="Feet"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                                placeholder="Inches"
                            />
                        </div>
                        <div>
                            <label className="text-lg">Weight</label>
                            <input
                                type="text"
                                className="mt-2 w-full p-3 rounded-md bg-gray-700 text-white"
                                placeholder="Lbs"
                            />
                        </div>

                        <div>
                            <label className="text-lg">Sex</label>

                            {/* <Box sx={{ height: '25%' }}> */}
                            <FormControl fullWidth className="h-2/5">
                                {/* <InputLabel id="demo-simple-select-label">Sex</InputLabel> */}
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={sex}
                                    label="Age"
                                    className="bg-gray-700 text-white rounded-lg"
                                    style={{ height: '50px', paddingTop: '10px', paddingBottom: '10px', marginTop: '7px' }}

                                    onChange={(e) => setSex(e.target.value)}
                                >
                                    <MenuItem value={Sex.Male}>Male</MenuItem>
                                    <MenuItem value={Sex.Female}>Female</MenuItem>
                                </Select>
                            </FormControl>
                            {/* </Box> */}

                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-lg">Birthday</label>
                    <input
                        type="date"
                        value={0}
                        onChange={(e) => { }}
                        className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                    />
                </div>



                <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition"
                >
                    Update
                </button>
            </form>
        </div>
    )
}