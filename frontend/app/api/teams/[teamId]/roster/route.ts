import { NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

// GET - Get team roster
export async function GET(request: Request, props: { params: Promise<{ teamId: string }> }) {
    const params = await props.params;
    try {
        const { teamId } = params
        if (!teamId) {
            return handleError('TeamID is required', 400);
        }

        console.log(teamId);
        const response = await fetch(`${process.env.SERVER_HOST}/team/${teamId}/roster`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            return handleError('Failed to fetch roster', 500);
        }
        const roster = await response.json();
        return NextResponse.json(roster, { status: 200 });
    } catch (error) {
        console.error(error);
        return handleError('Error fetching leagues', 500);
    }
}

export async function POST(request: Request, props: { params: Promise<{ teamId: string }> }) {
    const params = await props.params;
    const body = await request.json();
    const { name, sex, position, weight, height, birthdate } = body;
    const { teamId } = params;

    try {
        if (!teamId) {
            return handleError('TeamID is required', 400);
        }
        //CREATING PLAYER
        const newPlayer = await fetch(`${process.env.SERVER_HOST}/player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, sex, position, weight, height, birthdate }),
        })
        if (!newPlayer.ok) {
            const errorData = await newPlayer.json();
            return NextResponse.json({ error: errorData }, { status: newPlayer.status });
        }

        console.log(newPlayer);
        const player = await newPlayer.json();
        const playerId = player._id;
        const response = await fetch(`${process.env.SERVER_HOST}/team/${teamId}/roster`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error(error);
        return handleError('Failed to create player', 500);
    }
}

