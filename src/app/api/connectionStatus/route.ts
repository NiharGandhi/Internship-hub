// pages/api/updateStatus.js

import { client } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const connectionId = searchParams.get('connectionId');

    if (!connectionId) {
        return new NextResponse("[NO APPLICATION]", { status: 404 });
    }

    try {
        const statusResponse = await client.connectRequest.findUnique({
            where: {
                id: connectionId
            }
        })
        if (statusResponse)
            return new NextResponse(statusResponse.status);
    } catch (error) {
        console.log("[STATUS GET ERROR]: " + error)
        return new NextResponse("Error", { status: 404 });
    }
}

export async function POST(req: Request) {

    const { connectionId, status } = await req.json();
    console.log("ID: " + connectionId);
    console.log("Status: " + status);

    try {
        await client.connectRequest.update({
            where: {
                id: connectionId,
            },
            data: {
                status: status
            }
        })
        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[STATUS CHECK ERROR]: " + error)
        return new NextResponse("Error", { status: 404 });
    }
}
