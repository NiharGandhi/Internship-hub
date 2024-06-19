import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allInternships = await client.createInternship.findMany();

        if (!allInternships) {
            return NextResponse.json("No Internships found");
        }

        return NextResponse.json(allInternships);

    } catch (error) {
        console.log("[ALL INTERNSHIPS API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}