import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { parse } from "url";

export async function GET(req: Request,) {
    try {
        const { userId } = auth();
        const { pathname } = parse(req.url);
        console.log(pathname)
        const eventId = pathname?.split("/").pop();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const adminEvent = await client.events.findUnique({
            where: {
                id: eventId
            }
        })

        return NextResponse.json(adminEvent);
    } catch (error) {
        console.log("ERROR API", error);
    }
}

export async function PUT(req: Request,) {
    try {
        const { userId } = auth();

        const { pathname } = parse(req.url);
        console.log(pathname)
        const eventId = pathname?.split("/").pop();
        console.log(eventId);
        
        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { title, description, dateTime, link } = await req.json();

        const newEvent = await client.events.update({
            where: {
                id: eventId
            },
            data: {
                title: title,
                description: description,
                dateTime: dateTime,
                link: link,
            }
        })

        return NextResponse.json(newEvent);
    } catch (error) {
        console.log("ERROR API", error);
    }
}