import { NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

// GET - Get all teams
export async function GET(req: Request, props: { params: Promise<{ leagueId: string, seasonId: string }> }) {
    const params = await props.params;
    try {
        const { leagueId, seasonId } = params;
        if (!leagueId || !seasonId) {
            return handleError('LeagueID and Season ID is required', 400);
        }

        const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/season/${seasonId}/team`,
            {
                method: 'GET',
                headers: { 'Content-type': 'application/json' },
            })
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

//POST ADD TEAM
export async function POST(req: Request, props: { params: Promise<{ leagueId: string, seasonId: string }> }) {
    const params = await props.params;
    const body = await req.json();
    try {
        const { seasonId, leagueId } = params;
        const { name } = body;
        if (!leagueId || !seasonId) {
            return handleError('LeagueID and Season ID is required', 400);
        }
        const teamRes = await fetch(`${process.env.SERVER_HOST}/team`,
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ name })
            })

        if (!teamRes.ok)
            return handleError('Failed to create team', 500);

        const teamId = await teamRes.json();
        const team = teamId._id

        const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/season/${seasonId}/team`, {
            method: 'POST',
            headers: { 'Content=type': 'application/json' },
            body: JSON.stringify({ team })
        })

        if (!response.ok) {
            return handleError('Failed to fetch games', 500);
        }
        const newTeam = await response.json();
        return NextResponse.json(newTeam, { status: 200 });
    }
    catch (e) {
        return handleError('Error occurred while creating team', 500);
    }
}