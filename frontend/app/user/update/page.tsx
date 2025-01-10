'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSearchParams, useRouter } from "next/navigation";

export default function updatePage() {
    const [userId, setUserID] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState("M");
    const [weight, setWeight] = useState("");
    const [feet, setFeet] = useState("");
    const [inches, setInches] = useState("");
    const [birthdate, setBirthDate] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const router = useRouter();


    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const result = JSON.parse(storedUser);
            setUserID(result._id);
        }
        else {
            router.push("/")
        }
    }, [])


    useEffect(() => {
        if (!userId)
            return;
        const fetchUser = async () => {
            const response = await fetch('/api/users/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: userId }),
            });

            if (!response.ok) {
                //REDIRECT
            }
            else {
                const data = await response.json();
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
                setSex(data.sex || "M");
                setWeight(data.weight || '');
                if (data.birthdate) {
                    const date = data.birthdate.split("T")[0];
                    setBirthDate(date);
                }
                if (data.height) {
                    setFeet(data.height.feet);
                    setInches(data.height.inches);
                }
            }
        }
        fetchUser();
    }, [userId])


    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const height = {
            feet: feet,
            inches: inches
        }

        const response = await fetch(`/api/users/update`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: userId, firstName, lastName, sex, weight, birthdate, height }),
        })

        if (response.ok) {
            if (redirect) {
                router.push(redirect);
            }
            else {
                router.push("/leagues");
            }
            setErrorMsg(null);
        }
        else {
            const errorData = await response.json();
            setErrorMsg(errorData.message)
        }
    }

    const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
        const re = /^[0-9\b]{1,3}$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setWeight(e.target.value)
        }

    }

    const handleInchesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const re = /^[0-9\b]$/;
        const tw = /^[1][01]$/;
        if (e.target.value === '' || re.test(e.target.value) || tw.test(e.target.value))
            setInches(e.target.value);
    }

    const handleFeetChange = (e: ChangeEvent<HTMLInputElement>) => {
        const re = /^[0-9\b]$/;
        if (e.target.value === '' || re.test(e.target.value))
            setFeet(e.target.value);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4"></h1>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6 w-96 bg-gray-800 p-6 rounded-lg">
                <div>
                    <label className="text-lg">First Name</label>
                    <input
                        type="text"
                        className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-lg">Last Name</label>
                    <input
                        type="text"
                        className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                                value={feet}
                                onChange={handleFeetChange}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
                                placeholder="Inches"
                                value={inches}
                                onChange={handleInchesChange}
                            />
                        </div>
                        <div>
                            <label className="text-lg">Weight</label>
                            <input
                                type="text"
                                className="mt-2 w-full p-3 rounded-md bg-gray-700 text-white"
                                placeholder="Lbs"
                                value={weight}
                                onChange={handleWeightChange}
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
                                    <MenuItem value="M">Male</MenuItem>
                                    <MenuItem value="F">Female</MenuItem>
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
                        value={birthdate}
                        onChange={(e) => { setBirthDate(e.target.value) }}
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