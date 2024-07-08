import { NextResponse } from 'next/server';
import { client } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {

    // console.log("GET URL: ", req.url)
    const { searchParams } = new URL(req.url);
    const { userId } = auth();
    const targetUserId = searchParams.get("targetUserId");
    console.log(targetUserId)

    if (!userId) {
        return new NextResponse("UNAUTHORIZED", { status: 401 })
    }

    try {
        const connection = await client.connectRequest.findFirst({
            where: {
                senderUserId: userId,
                receiverUserId: targetUserId,
            }
        })

        return NextResponse.json(connection);
    } catch (error) {
        console.log("[CONNEECTION CHECK API ERROR]", error)
    }
}

export async function POST(req: Request) {
    const { targetUserId } = await req.json();
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await client.connectRequest.create({
            data: {
                senderUserId: userId,
                receiverUserId: targetUserId,
                status: 'PENDING',
            },
        });
        return NextResponse.json({ message: 'Connection request sent' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to send connection request' }, { status: 500 });
    }
}
