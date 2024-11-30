import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to handle errors
const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return handleError('Email and password are required', 400);
    }

    try {
        const response = await fetch(`${process.env.SERVER_HOST}/user`,
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    }
    catch (e) {
        return handleError("Failed to create new user", 500);
    }
}