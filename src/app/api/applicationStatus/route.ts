// pages/api/updateStatus.js

import { client } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
        return new NextResponse("[NO APPLICATION]", { status: 404 });
    }

    try {
        const statusResponse = await client.application.findUnique({
            where: {
                id: applicationId
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

    const { applicationId, status } = await req.json();
    // console.log("STATUS: " + status);
    // console.log("ID: " + applicationId)

    try {
        await client.application.update({
            where: {
                id: applicationId
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
