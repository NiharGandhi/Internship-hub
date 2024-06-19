import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { parse } from "url";

export async function GET(req: Request,) {
    try {
        const { userId } = auth();
        const { pathname } = parse(req.url);
        console.log(pathname)
        const projectId = pathname?.split("/").pop();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const usersProject = await client.project.findUnique({
            where: {
                id: projectId
            }
        })

        return NextResponse.json(usersProject);
    } catch (error) {
        console.log("ERROR API", error);
    }
}

export async function PUT(req: Request,) {
    try {
        const { userId } = auth();

        const { pathname } = parse(req.url);
        console.log(pathname)
        const projectId = pathname?.split("/").pop();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { name, description, link, imageUrl } = await req.json();

        const newCertificate = await client.project.update({
            where: {
                id: projectId
            },
            data: {
                userId: userId,
                name: name,
                description: description,
                link: link,
                imageUrl: imageUrl
            }
        })

        return NextResponse.json(newCertificate);
    } catch (error) {
        console.log("ERROR API", error);
    }
}