import { NextRequest, NextResponse } from "next/server";

// Helper function to handle errors
const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');

    try {
        const response = await fetch(`${process.env.SERVER_HOST}/team/${id}/roster`);

        if (!response.ok) {
            return handleError("Failed fetching roster", 500);
        }
    }
    catch (e) {
        return handleError("Error fetching roster", 500);
    }
}