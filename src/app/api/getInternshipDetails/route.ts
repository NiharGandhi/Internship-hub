import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get('internshipId');

    if (!internshipId) {
        return new NextResponse("Error", { status: 404 });
    }

    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const internship = await client.createInternship.findUnique({
            where: {
                id: internshipId,
            }
        })

        const company = await client.company.findUnique({
            where: {
                userId: internship?.userId
            }
        })

        if (!internship) {
            return new NextResponse("Error", { status: 404 });
        }

        if (!company) {
            return new NextResponse("Error", { status: 404 });
        }

        return NextResponse.json({ internship, company });

    } catch (error) {
        console.log("[ALL ORGANIZATION API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}