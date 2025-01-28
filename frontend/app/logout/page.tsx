'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Logout() {
    const router = useRouter();


    const handleLogout = async function () {
        await fetch(`/api/logout`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        sessionStorage.setItem('login', "False");
    }
    // handleLogout();
    useEffect(() => {
        router.push('/');

    }, [])

}