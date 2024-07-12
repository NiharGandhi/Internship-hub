import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { userId } = auth();
        const { searchParams } = new URL(req.url);
        const take = parseInt(searchParams.get('take') || '10');
        const skip = parseInt(searchParams.get('skip') || '1');
        const searchQuery = searchParams.get('searchQuery') || ''; 
        const skill = searchParams.get('skill') || '';
        const institution = searchParams.get('institution') || '';
        const educationLevel = searchParams.get('educationLevel') || '';

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        };

        const allUsers = await client.user.findMany({
            take: take,
            skip: skip,
            orderBy: {
                id: "asc"
            },
            where: {
                name: {
                    contains: searchQuery
                },
                skills: {
                    contains: skill
                },
                InstitutionName: {
                    contains: institution
                },
                EducationLevel: {
                    contains: educationLevel
                }
            },
        });

        const allSkills = await client.user.findMany({
            select: {
                skills: true
            }
        });

        const allInstitutions = await client.user.findMany({
            select: {
                InstitutionName: true
            }
        })

        const allEducationLevels = await client.user.findMany({
            select: {
                EducationLevel: true
            }
        })

        const count = await client.user.count();

        if (!allUsers) {
            return NextResponse.json("No users found");
        }

        return NextResponse.json({ allUsers, count, metadata: {
            hasNextPage: skip + take < count,
            totalPages: Math.ceil(count / take)
        }, allSkills, allInstitutions, allEducationLevels });

    } catch (error) {
        console.log("[ALL USERS API]" + error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}