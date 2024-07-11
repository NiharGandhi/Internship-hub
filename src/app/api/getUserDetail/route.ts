import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new NextResponse("Error", { status: 404 });
    }

    try {
        const user = await client.user.findUnique({
            where: {
                id: userId,
            }
        })

        if (!user) {
            return new NextResponse("Error", { status: 404 });
        }

        const projects = await client.project.findMany({
            where: {
                userId: user?.userId,
            },
        })

        const certificates = await client.certificate.findMany({
            where: {
                userId: user?.userId,
            }
        });


        if (!projects) {
            return NextResponse.json([]);
        }

        if (!certificates) {
            return NextResponse.json([]);
        }

        return NextResponse.json({ user, projects, certificates });

    } catch (error) {
        console.log("[ALL GET USER DETAILS API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}