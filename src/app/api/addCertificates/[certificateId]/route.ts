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
        const certificateId = pathname?.split("/").pop();

        // Check if projectId is provided
        if (!certificateId) {
            return new NextResponse("Project ID not provided", { status: 400 });
        }

        // Find the project by ID and check if it belongs to the authenticated user
        const certificate = await client.certificate.findFirst({
            where: {
                id: certificateId,
                userId: userId
            }
        });

        // If project is not found or doesn't belong to the user, return 404 Not Found
        if (!certificate) {
            return new NextResponse("Project not found", { status: 404 });
        }

        // Delete the project
        await client.certificate.delete({
            where: {
                id: certificateId
            }
        });

        return new NextResponse("Project deleted successfully", { status: 200 });
    } catch (error) {
        console.log("DELETE CATCH")
        console.log("ERROR API", error);
        return new NextResponse("Internal Server Error [PROJECT DELETE]", { status: 500 });
    }
}