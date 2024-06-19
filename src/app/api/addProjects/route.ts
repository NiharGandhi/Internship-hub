// pages/api/projects.ts

import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request,) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { name, description, link, imageUrl } = await req.json();

        const newProject = await client.project.create({
            data: {
                userId: userId,
                name: name,
                description: description,
                link: link,
                imageUrl: imageUrl
            }
        })

        return NextResponse.json(newProject);
    } catch (error) {
        console.log("ERROR API", error);
    }
}

export async function PUT(req: Request,) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { name, description, link, imageUrl } = await req.json();

        const newProject = await client.project.create({
            data: {
                userId: userId,
                name: name,
                description: description,
                link: link,
                imageUrl: imageUrl,
            }
        })

        return NextResponse.json(newProject);
    } catch (error) {
        console.log("ERROR API", error);
    }
}

export async function GET(req: Request,) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const usersProjects = await client.project.findMany({
            where: {
                userId: userId
            }
        })

        return NextResponse.json(usersProjects);
    } catch (error) {
        console.log("ERROR API", error);
    }
}