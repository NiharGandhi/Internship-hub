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
        const newOnlineResource = await client.onlineReourses.create({
            data: {
                name: name,
                desc: desc,
                link: link,
            },
        });

        return NextResponse.json(newOnlineResource);

    } catch (error) {
        console.log("[ONLINE RESOURCE CREATION/UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingOnlineResource = await client.onlineReourses.findMany();

        if (!existingOnlineResource) {
            return new NextResponse("No Online Resources Found", { status: 404 });
        }

        return NextResponse.json(existingOnlineResource);
    } catch (error) {
        console.error("[ONLINE RESOURCES RETRIEVAL]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
