'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function Login() {

    const [email, setEmail] = useState('');

    const handleFormSumbit = () => {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
    };

    const checkEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        let email = event.target.value;
        let match = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        const error = document.getElementById("EmailError")!;
        if (match == null) {
            error.textContent = "Invalid Email";
        }
        else {
            error.textContent = "";
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
            <form className='grid grid-rows-1 gap-2'>
                <label htmlFor="email" className="mb-0">Email</label>
                <input type="text" className="rounded-md text-black p-3 w-80" name="email" id="email"></input>
                <div id="emailError" className="text-red-500"></div>
                <label htmlFor="password" className="mb-0">Password</label>
                <input type="password" className="rounded-md text-black p-3 w-80" name="password" id="password" ></input>
                <button className='rounded bg-blue-500 hover:bg-blue-700 mt-3 p-2' onSubmit={handleFormSumbit}>Sign In</button>
            </form>
        </div>);
}