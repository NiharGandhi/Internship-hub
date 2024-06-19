// pages/api/messages.js

import { client } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
        return new NextResponse("Error, Unauthorized", { status: 401 });
    }

    try {
        const messages = await client.message.findMany({
            where: {
                applicationId: applicationId,
            },
            include: {
                senderCompany: true,
                receiverUser: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return new NextResponse(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        console.log("[MESSAGES GET ERROR]: " + error);
        return new NextResponse("Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const { applicationId, content } = await req.json();
    const { userId } = auth(); // Ensure you have a way to get the logged-in user

    try {
        const application = await client.application.findUnique({
            where: { id: applicationId },
            include: { user: true, internship: true },
        });

        if (!application) {
            return new NextResponse("Application not found", { status: 404 });
        }

        const newMessage = await client.message.create({
            data: {
                content: content,
                applicationId: applicationId,
                senderUserId: userId, // Assuming the user is the company
                receiverUserId: application.user.id,
            },
        });

        return new NextResponse(JSON.stringify(newMessage), { status: 201 });
    } catch (error) {
        console.log("[MESSAGES POST ERROR]: " + error);
        return new NextResponse("Error", { status: 500 });
    }
}
