'use client'
import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const getLoginStatus = () => {
    /**
     * Checks to see if refresh token is in cookies
     * if it is, it means user has logged in
     */
    const loginToken = document.cookie.match('(^|;)\\s*' + "refreshToken" + '\\s*=\\s*([^;]+)');
    if (!loginToken) return false
    return true
}

export default function Navbar() {
    const hiddenPages = [
        '/',
        '/login',
        '/signup'
    ]
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const isLoggedIn = sessionStorage.getItem("login") == "True"

    const loggedIn = getLoginStatus()


    const handleClose = () => {
        setAnchorEl(null);
    };
    const path = usePathname();
    if (hiddenPages.includes(path)) {
        return null
    }
    const userMenu = () => {
        return (
            <div className='h-full'>
                <button
                    onClick={handleClick}
                    className='text-white font-bold text-lg hover:font-extrabold'
                >
                    Profile
                </button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleClose}><Link href="/user/update">My Profile</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Link href="">My Leagues</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Link href="/logout">Logout</Link></MenuItem>
                </Menu>
            </div>
        )
    }
    return (
        <nav className="w-full h-12 bg-slate-800 bg-opacity-100">
            <ul className='flex w-full flex-grow items-center'>
                <li className='h-full px-3 py-2 text-white font-bold hover:font-extrabold text-lg ml-3'>
                    <Link href="/">Home</Link>
                </li>
                <li className='h-full px-3 py-2 text-white font-bold hover:font-extrabold text-lg'>
                    <Link href="/leagues">Leagues</Link>
                </li>
                <li className='h-full px-4 py-2 text-white font-bold hover:font-extrabold text-lg ml-auto'>
                    {loggedIn ? userMenu() : <Link href={`/login?redirect=${path}`}>Login</Link>}

                </li>
            </ul>
        </nav>
    );
}
