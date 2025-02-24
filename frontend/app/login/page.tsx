'use client';
import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const redirect = searchParams.get('redirect');

    const handleFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (emailError === "") {
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
                    sessionStorage.setItem('login', "True");

                    const storedUser = sessionStorage.getItem('user');
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        console.log(user);
                    }

                    setLoginError(null);
                    if (redirect)
                        router.push(`${redirect}`);
                    else
                        router.push('/leagues');
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
        if (validEmail(event.target.value)) {
            setEmailError("");
        } else {
            setEmailError("Invalid Email");
        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const validEmail = (e: String) => {
        const match = e.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
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
            <p>
                Don't have an account?{" "}
                <a onClick={() => {
                    if (redirect) {
                        router.push(`/signup?redirect=${redirect}`)
                    }
                    else {
                        router.push('/signup')
                    }
                }} className="text-blue-600 hover:text-blue-500 font-semibold">
                    Sign Up
                </a>
            </p>
        </div>
    );
}
