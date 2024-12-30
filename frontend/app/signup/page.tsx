'use client'
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [signUpError, setSignUpError] = useState<string | null>(null);

    useEffect(() => {
        setIsFormValid((emailError === "") && email.length > 0 && password === confirmPassword && password.length > 0 && confirmPassword.length > 0)
    }, [email, emailError, password, confirmPassword]);

    const handleFormSumbit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isFormValid) {
            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setSignUpError(errorData.message);
                }
                else {
                    router.push("/")
                }
            } catch (e) {
                //ERROR SHOW SNACKBAR
                console.error(e);
            }

        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }
    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if (validEmail(event.target.value))
            setEmailError("");
        else
            setEmailError('Invalid Email');
    }
    const validEmail = (e: String) => {
        const match = e.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        return !(match === null);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
            <form className='grid grid-rows-1 gap-2' onSubmit={handleFormSumbit}>
                <label htmlFor="email" className="mb-0">Email</label>
                <input type="text" className="rounded-md text-black p-3 w-80" name="email" id="email" onChange={handleEmailChange} value={email} required></input>
                {emailError && <div className='text-red-500'>{emailError}</div>}
                <label htmlFor="password" className="mb-0">Password</label>
                <input type="password" className="rounded-md text-black p-3 w-80" name="password" id="password" onChange={handlePasswordChange} value={password} required></input>
                <label htmlFor="comfirm password" className='mb-0'>Confirm Password</label>
                <input type="password" className="rounded-md text-black p-3 w-80" name="confirmpassword" id="password2" onChange={handleConfirmPasswordChange} value={confirmPassword} required></input>
                {!(password === confirmPassword) && <div className="text-red-500">Passwords Do Not Match</div>}
                {signUpError && <div className="text-red-500">{signUpError}</div>}
                <button
                    type="submit"
                    className={`rounded bg-blue-500 hover:bg-blue-700 mt-3 p-2 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isFormValid}>
                    Sign Up
                </button>
            </form>
        </div>);
}