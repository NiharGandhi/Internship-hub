import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request,) {
    try {
        const projects = await client.project.findMany({
            include: {
                user: true,
            }
        });

        if (!projects) {
            return NextResponse.json([]);
        }

        return NextResponse.json({ projects });
    } catch (error) {
        console.log("ERROR API", error);
    }
}