import { NextResponse } from 'next/server';

// Helper function to handle errors
const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

// GET - Get all leagues
export async function GET(request: Request, props: { params: Promise<{ leagueId: string }> }) {
    const params = await props.params;

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    try {
        const { leagueId } = params;

        if (!leagueId) {
            return handleError('LeagueID is required', 400);
        }

        console.log(leagueId);
        const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/userStatus?userId=${userId}`);
        if (!response.ok) {
            return handleError('Failed to fetch leagues', 500);
        }
        const leagues = await response.json();
        return NextResponse.json(leagues, { status: 200 });
    } catch (error) {
        console.error(error);
        return handleError('Error fetching leagues', 500);
    }
}

