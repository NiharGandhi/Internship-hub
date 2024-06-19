import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { name, desc, link } = await req.json();

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }


        // If the user does not exist, create a new user
        const newUsefulTools = await client.usefulTools.create({
            data: {
                name: name,
                desc: desc,
                link: link,
            },
        });

        return NextResponse.json(newUsefulTools);

    } catch (error) {
        console.log("[USEFUL TOOL CREATION/UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingUsefulTools = await client.usefulTools.findMany();

        if (!existingUsefulTools) {
            return NextResponse.json("Not Useful Tools Found");
        }

        return NextResponse.json(existingUsefulTools);
    } catch (error) {
        console.error("[USEFUL TOOL RETRIEVAL]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
