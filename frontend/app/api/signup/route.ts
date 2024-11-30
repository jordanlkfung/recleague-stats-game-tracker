import { NextRequest, NextResponse } from 'next/server';

// Helper function to handle errors
const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

export async function POST(req: NextRequest) {
    const body = await req.json();

}