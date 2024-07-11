import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("fetching...");
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    console.log("UID: ", userId);

    if (!userId) {
        return new NextResponse("Error", { status: 404 });
    }

    try {
        const user = await client.user.findUnique({
            where: {
                id: userId,
            }
        })

        console.log("user: ", user);

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
        console.log("[ALL ORGANIZATION API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}