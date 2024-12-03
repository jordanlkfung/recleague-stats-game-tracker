import { NextRequest, NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
  return NextResponse.json({ message }, { status });
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');  

  if (!id) {
    return handleError('User ID is required', 400);
  }

  try {
    const response = await fetch(`${process.env.SERVER_HOST}/user/${id}/leagues`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const leagues = await response.json();
    return NextResponse.json(leagues, { status: 200 });
  } catch (error) {
    console.error('Error fetching user leagues:', error);
    return handleError('Failed to fetch user leagues', 500);
  }
}
