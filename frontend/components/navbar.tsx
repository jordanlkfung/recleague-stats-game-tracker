'use client'
import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';


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
    const handleClose = () => {
        setAnchorEl(null);
    };
    const path = usePathname();
    if (hiddenPages.includes(path)) {
        return null
    }
    const userMenu = () => {
        return (
            <div>
                <Button
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className='text-white font-bold text-lg'
                >
                    Profile
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleClose}>My account</MenuItem>
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
                <li>
                    {userMenu()}
                </li>
                <li className='h-full px-4 py-2 text-white font-bold hover:font-extrabold text-lg ml-auto'>
                    <Link href={`/login?redirect=${path}`}>Login</Link>
                </li>
            </ul>
        </nav>
    );
}
