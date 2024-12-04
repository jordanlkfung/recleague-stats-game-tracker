import { NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};

// GET - Get by ID
export async function GET(req: Request, props: { params: Promise<{ gameId: string }> }) {
    const params = await props.params;
    try {
        const { gameId } = params;
        if (!gameId) {
            return handleError('Game ID is required', 400);
        }
        
        const response = await fetch(`${process.env.SERVER_HOST}/game/${gameId}`,
            {
                method: 'GET',
                headers: { 'Content-type': 'application/json' },
            })
        if (!response.ok) {
        return handleError('Failed to fetch game by ID', 500);
        }
        const game = await response.json();
        return NextResponse.json(game, { status: 200 });
    } catch (error) {
        console.error(error);
        return handleError('Error fetching game by ID', 500);
    }
}



