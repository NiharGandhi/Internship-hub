import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { parse } from "url";

export async function GET(req: Request,) {
    try {
        const { userId } = auth();
        const { pathname } = parse(req.url);
        console.log(pathname)
        const internshipId = pathname?.split("/").pop();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const companyInternships = await client.createInternship.findUnique({
            where: {
                id: internshipId
            }
        })

        return NextResponse.json(companyInternships);
    } catch (error) {
        console.log("ERROR API", error);
    }
}

export async function PUT(req: Request,) {
    try {
        const { userId } = auth();

        const { pathname } = parse(req.url);
        console.log(pathname)
        const internshipId = pathname?.split("/").pop();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { name, educationLevel, internshipDescription, internshipRequirement, paid, amountPaid, internshipType } = await req.json();

        const newInternship = await client.createInternship.update({
            where: {
                id: internshipId
            },
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

        return NextResponse.json(newInternship);
    } catch (error) {
        console.log("ERROR API", error);
    }
}