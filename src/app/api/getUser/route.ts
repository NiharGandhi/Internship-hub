import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const { userId } = auth();

        if (!userId || !id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingUser = await client.user.findUnique({
            where: { id: id },
        });

        if (!existingUser) {
            return NextResponse.json(null);
        }

        return NextResponse.json(existingUser);
    } catch (error) {
        console.error("[USERS RETRIEVAL]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}