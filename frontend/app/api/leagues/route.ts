import { NextRequest, NextResponse } from 'next/server';

// Helper function to handle errors
const handleError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};

// POST - Add a new league
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, sport } = body;

  // Validate input
  if (!name || !sport) {
    return handleError('Name and sport are required', 400);
  }

  try {
    const response = await fetch(`${process.env.SERVER_HOST}/leagues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, sport }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return handleError('Failed to create the league', 500);
  }
}

// GET - Get all leagues
export async function GET() {
  try {
    const response = await fetch(`${process.env.SERVER_HOST}/leagues`);
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

