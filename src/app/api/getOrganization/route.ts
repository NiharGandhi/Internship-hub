import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    
    if (!orgId) {
        return new NextResponse("Error", { status: 404 });
    }

    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const company = await client.company.findUnique({
            where: {
                id: orgId
            }
        });

        const internships = await client.createInternship.findMany({
            where: {
                userId: company?.userId
            }
        })

        if (!company) {
            return new NextResponse("Error", { status: 404 });
        }

        if (!internships) {
            return NextResponse.json([]);
        }

        return NextResponse.json({ company, internships });

    } catch (error) {
        console.log("[ALL ORGANIZATION API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}