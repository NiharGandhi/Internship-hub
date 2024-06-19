import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { title, dateOfEvent, description, link } = await req.json();

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }

    
            // If the user does not exist, create a new user
        const newEvent = await client.events.create({
            data: {
                title: title,
                dateTime: dateOfEvent,
                description: description,
                link: link
            },
        });

        return NextResponse.json(newEvent);

    } catch (error) {
        console.log("[EVENT CREATION/UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingEvent = await client.events.findMany();

        if (!existingEvent) {
            return new NextResponse("No Events Found", { status: 404 });
        }

        return NextResponse.json(existingEvent);
    } catch (error) {
        console.error("[EVENT RETRIEVAL]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
