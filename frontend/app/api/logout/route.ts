import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await fetch(`${process.env.SERVER_HOST}/user/logout`, {
            method: 'GET',
            headers: { 'Content-Type': 'applicaiton/json' }
        })
    }
    catch (error) {

    }
}