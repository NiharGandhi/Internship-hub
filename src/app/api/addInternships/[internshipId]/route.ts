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
        const projectId = pathname?.split("/").pop();
        console.log(projectId);

        // Check if projectId is provided
        if (!projectId) {
            return new NextResponse("Project ID not provided", { status: 400 });
        }

        // Find the project by ID and check if it belongs to the authenticated user
        const project = await client.createInternship.findFirst({
            where: {
                id: projectId,
                userId: userId
            }
        });

        const applications = await client.application.findMany({
            where: {
                internshipId: projectId
            }
        })

        // If project is not found or doesn't belong to the user, return 404 Not Found
        if (!project) {
            console.log("Project not found")
            return new NextResponse("Project not found", { status: 404 });
        }

        await client.application.deleteMany({
            where: {
                internshipId: projectId
            }
        })

        // Delete the project
        await client.createInternship.delete({
            where: {
                id: projectId,
                userId: userId,
            }
        });

        return new NextResponse("Project deleted successfully", { status: 200 });
    } catch (error) {
        console.log("DELETE CATCH")
        console.log("ERROR API", error);
        return new NextResponse("Internal Server Error [PROJECT DELETE]", { status: 500 });
    }
}