import { NextRequest, NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

//DELETE - Leave League
export async function DELETE(req: NextRequest, props: { params: Promise<{ leagueId: string }> }) {

    const body = await req.json();
    const { userID } = body;
    const params = await props.params;


    if (!userID) {
        return handleError('User not provided', 400);
    }

    try {
        const { leagueId } = params;
        const response = await fetch(`${process.env.SERVER_HOST}/league/${leagueId}/playerPool`,
            {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ userId: userID })
            })
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return handleError("Failed leave league", 500);
    }
}