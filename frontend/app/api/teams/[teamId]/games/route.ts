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
        const response = await fetch(`${process.env.SERVER_HOST}/game/team/${teamId}`);
        if (!response.ok) {
            return handleError('Failed to fetch games', 500);
        }
        const games = await response.json();
        return NextResponse.json(games, { status: 200 });
    } catch (error) {
        console.error(error);
        return handleError('Error fetching games', 500);
    }
}

