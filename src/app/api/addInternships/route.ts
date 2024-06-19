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

        const { name, educationLevel, internshipType, internshipDescription, internshipRequirement, paid, amountPaid } = await req.json();

        const newProject = await client.createInternship.create({
            data: {
                userId: userId,
                name: name,
                EducationLevel: educationLevel,
                InternshipDescription: internshipDescription,
                InternshipRequirement: internshipRequirement,
                Paid: paid,
                AmountPaid: amountPaid,
                InternshipType: internshipType,
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

        const usersProjects = await client.createInternship.findMany({
            where: {
                userId: userId
            }
        })

        return NextResponse.json(usersProjects);
    } catch (error) {
        console.log("ERROR API", error);
    }
}