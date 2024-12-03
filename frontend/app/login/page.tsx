'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleFormSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (validEmail()) {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setLoginError(errorData.message || 'Invalid credentials');
                } else {
                    const data = await response.json();

                    sessionStorage.setItem('user', JSON.stringify(data.user));

                    const storedUser = sessionStorage.getItem('user');
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        console.log(user); 
                    }

                    setLoginError(null);
                    router.push("/leagues"); 
                }
            } catch (e) {
                console.error("Login error:", e);
                setLoginError('An error occurred while logging in.');
            }
        } else {
            setLoginError('Please provide a valid email.');
        }
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if (validEmail()) {
            setEmailError("");
        } else {
            setEmailError("Invalid Email");
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const validEmail = () => {
        const match = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        return !(match === null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
            <form className="grid grid-rows-1 gap-2">
                <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
                <label htmlFor="email" className="mb-0">Email</label>
                <input
                    type="text"
                    className="rounded-md text-black p-3 w-80"
                    name="email"
                    id="email"
                    onChange={handleEmailChange}
                    value={email}
                    required
                />
                {emailError && <div className="text-red-500">{emailError}</div>}
                <label htmlFor="password" className="mb-0">Password</label>
                <input
                    type="password"
                    className="rounded-md text-black p-3 w-80"
                    name="password"
                    id="password"
                    onChange={handlePasswordChange}
                    value={password}
                    required
                />
                {loginError && <div className="text-red-500">{loginError}</div>}
                <button
                    className="rounded bg-blue-500 hover:bg-blue-700 mt-3 p-2"
                    onClick={handleFormSubmit}
                >
                    Login
                </button>
            </form>
        </div>
    );
}
