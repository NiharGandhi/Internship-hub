import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const allCompanies = await client.company.findMany();

        if (!allCompanies) {
            return NextResponse.json("No Companies found");
        }

        return NextResponse.json(allCompanies);

    } catch (error) {
        console.log("[ALL COMPANIES API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}