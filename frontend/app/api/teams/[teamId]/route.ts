import { NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};


// GET - Get team by ID
export async function GET(req: Request, props: { params: Promise<{ teamId: string }> }) {
    const params = await props.params;
    const { teamId } = params;
  
    try {
      const response = await fetch(`${process.env.SERVER_HOST}/team/${teamId }`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
      });
  
      if (!response.ok) {
        return handleError('Failed to fetch team', 500);
      }
  
      const team = await response.json();
      return NextResponse.json(team, { status: 200 });
    } catch (error) {
      console.error(error);
      return handleError('Error fetching team by ID', 500);
    }
  }