import { NextRequest, NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

//POST - Log In
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return handleError('Email and password are required', 400);
    }

    try {
        const response = await fetch(`${process.env.SERVER_HOST}/user/login`,
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
        return NextResponse.json(data, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return handleError("Failed to create new user", 500);
    }
}