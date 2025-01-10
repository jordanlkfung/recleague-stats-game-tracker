import { NextRequest, NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

//POST - Get User Info
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { _id } = body;

    if (!_id) {
        return handleError('No user id provided', 400);
    }

    try {
        const response = await fetch(`${process.env.SERVER_HOST}/user/info`,
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ _id })
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
        return handleError("Failed to get user info", 500);
    }
}