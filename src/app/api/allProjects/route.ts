import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request,) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const projects = await client.project.findMany({
            include: {
                user: true,
            }
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.log("ERROR API", error);
    }
}