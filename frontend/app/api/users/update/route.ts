import { NextRequest, NextResponse } from 'next/server';

const handleError = (message: string, status: number) => {
    return NextResponse.json({ message }, { status });
};

//POST - Update user info
export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const { _id, height, weight, sex, firstName, lastName, birthdate } = body;
    console.log(body)
    if (!_id) {
        return handleError('No user id provided', 400);
    }

    try {
        // const response = await fetch(`${process.env.SERVER_HOST}/user/info`,
        const response = await fetch(`${process.env.SERVER_HOST}/user/${_id}`,
            {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
                // body: JSON.stringify({ _id, height, weight, sex, firstName, lastName, birthdate })
                body: JSON.stringify({ height, weight, sex, firstName, lastName, birthdate })

            })
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData }, { status: response.status });
        }
        // const data = await response.json();
        // return NextResponse.json(data, { status: 200 });
        return NextResponse.json({ status: 204 })
    }
    catch (e) {
        console.error(e);
        return handleError("Failed to update user", 500);
    }
}