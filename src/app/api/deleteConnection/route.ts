import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id } = await req.json();
    const { userId } = auth();
    console.log("ID: ",id);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await client.connectRequest.delete({
            where: {
                id: id,
            },
        });
        return NextResponse.json({ message: 'Connection request sent' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to send connection request' }, { status: 500 });
    }
}