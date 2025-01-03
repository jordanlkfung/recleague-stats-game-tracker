import { NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};

// POST - Add Season
export async function POST(req: Request, props: { params: Promise<{ leagueId: string }> }) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { start_date, end_date } = body;
        
        if (!start_date || !end_date) {
            return handleError('Start and end date are required', 400);
        }
        const { leagueId } = params
        if (!leagueId) {
            console.log('Try')
            return handleError('LeagueID is required', 400);
        }

        console.log(start_date)
        console.log(end_date)
        
        const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/season`,
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ start_date, end_date })
            })
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

// DELETE - Delete a season
export async function DELETE(req: Request, props: { params: Promise<{ leagueId: string }> }) {
    const params = await props.params;

    try {
        const body = await req.json();
        const { seasonId } = body;

        if (!seasonId) {
            return handleError('Season ID is required', 400);
        }

        const { leagueId } = params;
        if (!leagueId) {
            return handleError('League ID is required', 400);
        }

        const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/season`, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ seasonId }),
        });

        if (!response.ok) {
            const error = await response.json();
            return handleError(`Failed to delete season: ${error.message}`, response.status);
        }

        return NextResponse.json({ message: 'Season deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting season:', error);
        return handleError('Internal Server Error', 500);
    }
}

