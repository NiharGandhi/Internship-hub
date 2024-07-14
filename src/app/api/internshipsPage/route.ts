import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // const { userId } = auth();

        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const allInternships = await client.createInternship.findMany({
            include: {
                user: true
            }
        });

        if (!allInternships) {
            return NextResponse.json("No Internships found");
        }

        return NextResponse.json(allInternships);

    } catch (error) {
        console.log("[ALL INTERNSHIPS API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}