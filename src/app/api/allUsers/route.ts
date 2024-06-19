import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const allUsers = await client.user.findMany();

        if (!allUsers) {
            return NextResponse.json("No users found");
        }

        return NextResponse.json(allUsers);

    } catch (error) {
        console.log("[ALL USERS API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}