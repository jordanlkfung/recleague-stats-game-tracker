import { NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};

// GET - Get all games
export async function GET(req: Request, props: { params: Promise<{ leagueId: string, seasonId: string }> }) {
    const params = await props.params;
    try {
        const { leagueId, seasonId } = params;
        if (!leagueId || !seasonId) {
            return handleError('LeagueID and Season ID is required', 400);
        }
        
        const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/season/${seasonId}/game`,
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

// DELETE - Delete a game
// export async function DELETE(req: Request, props: { params: Promise<{ leagueId: string }> }) {
//     const params = await props.params;

//     try {
//         const body = await req.json();
//         const { seasonId } = body;

//         if (!seasonId) {
//             return handleError('Season ID is required', 400);
//         }

//         const { leagueId } = params;
//         if (!leagueId) {
//             return handleError('League ID is required', 400);
//         }

//         const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/season`, {
//             method: 'DELETE',
//             headers: { 'Content-type': 'application/json' },
//             body: JSON.stringify({ seasonId }),
//         });

//         if (!response.ok) {
//             const error = await response.json();
//             return handleError(`Failed to delete season: ${error.message}`, response.status);
//         }

//         return NextResponse.json({ message: 'Season deleted successfully' }, { status: 200 });
//     } catch (error) {
//         console.error('Error deleting season:', error);
//         return handleError('Internal Server Error', 500);
//     }
// }

