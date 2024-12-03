import { NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

//GET - Get all users
export async function GET() {
    try {
        const response = await fetch(`${process.env.SERVER_HOST}/user`);
        if (!response.ok) {
          return handleError('Failed to fetch users', 500);
        }
        const users = await response.json();
        return NextResponse.json(users, { status: 200 });
      } catch (error) {
        console.error(error);
        return handleError('Error fetching users', 500);
      }
}