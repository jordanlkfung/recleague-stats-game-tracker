'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<String>('');
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState('')
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleFormSumbit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (passwordsMatch && validEmail()) {
            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {

                }
                else {
                    router.push("")
                }
            } catch (e) {
                //ERROR SHOW SNACKBAR
            }

        }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setPasswordsMatch(event.target.value === confirmpassword);
        disableSignUpButton();
    }
    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        setPasswordsMatch(password === event.target.value);
        disableSignUpButton()
    }
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if (validEmail())
            setEmailError("");
        else
            setEmailError('Invalid Email');
        disableSignUpButton();
    }
    const validEmail = () => {
        let match = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        return !(match === null);
    }
    const disableSignUpButton = () => {
        const button = document.getElementById("signUpBtn")!;
        if (emailError || !passwordsMatch)
            button.setAttribute('disabled', '');
        else
            button.removeAttribute('disabled');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
            <form className='grid grid-rows-1 gap-2'>
                <label htmlFor="email" className="mb-0">Email</label>
                <input type="text" className="rounded-md text-black p-3 w-80" name="email" id="email" onChange={handleEmailChange} value={email} required></input>
                {emailError && <div className='text-red-500'>{emailError}</div>}
                <label htmlFor="password" className="mb-0">Password</label>
                <input type="password" className="rounded-md text-black p-3 w-80" name="password" id="password" onChange={handlePasswordChange} value={password} required></input>
                <label htmlFor="comfirm password" className='mb-0'>Confirm Password</label>
                <input type="password" className="rounded-md text-black p-3 w-80" name="confirmpassword" id="password2" onChange={handleConfirmPasswordChange} value={confirmpassword} required></input>
                {!passwordsMatch && <div className="text-red-500">Passwords Do Not Match</div>}
                <button className='rounded bg-blue-500 hover:bg-blue-700 mt-3 p-2' onSubmit={handleFormSumbit} id="signUpBtn" >Sign Up</button>
            </form>
        </div>);
}