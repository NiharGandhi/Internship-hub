import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { parse } from "url";

export async function DELETE(req: any) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { pathname } = parse(req.url);
        const eventId = pathname?.split("/").pop();

        // Check if projectId is provided
        if (!eventId) {
            return new NextResponse("Event ID not provided", { status: 400 });
        }

        const event = await client.events.findUnique({
            where: {
                id: eventId,
            }
        });

        // If project is not found or doesn't belong to the user, return 404 Not Found
        if (!event) {
            return new NextResponse("Event not found", { status: 404 });
        }

        // Delete the project
        await client.events.delete({
            where: {
                id: eventId
            }
        });

        return new NextResponse("Event deleted successfully", { status: 200 });
    } catch (error) {
        console.log("ERROR API", error);
        return new NextResponse("Internal Server Error [EVENT DELETE]", { status: 500 });
    }
}