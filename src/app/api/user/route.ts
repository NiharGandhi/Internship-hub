import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { name, bio, institutionName, educationLevel, yearOfGrad, skills, email, resumeUrl, instagramLink, linkedInLink, xLink } = await req.json();

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }

        // Check if the user already exists
        const existingUser = await client.user.findUnique({
            where: { userId: userId },
        });

        if (existingUser) {
            // If the user exists, update the user data
            const updateUser = await client.user.update({
                where: {
                    userId: userId,
                },
                data: {
                    name: name,
                    bio: bio,
                    EducationLevel: educationLevel,
                    InstitutionName: institutionName,
                    GraduationDate: yearOfGrad,
                    skills: skills,
                    email: email,
                    resume: resumeUrl,
                    instagramLink: instagramLink,
                    linkedInLink: linkedInLink,
                    xLink: xLink,
                }
            })

            return NextResponse.json(updateUser);
        } else {
            // If the user does not exist, create a new user
            const newUser = await client.user.create({
                data: {
                    userId: userId,
                    name: name,
                    bio: bio,
                    EducationLevel: educationLevel,
                    InstitutionName: institutionName,
                    GraduationDate: yearOfGrad,
                    skills: skills,
                    email: email,
                    resume: resumeUrl,
                    instagramLink: instagramLink,
                    linkedInLink: linkedInLink,
                    xLink: xLink,
                },
            });

            return NextResponse.json(newUser);
        }
    } catch (error) {
        console.log("[USER CREATION/UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingUser = await client.user.findUnique({
            where: { userId: userId },
        });

        if (!existingUser) {
            return NextResponse.json(null);
        }

        return NextResponse.json(existingUser);
    } catch (error) {
        console.error("[USERS RETRIEVAL]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { userId } = auth();
        const { name, bio, institutionName, educationLevel, yearOfGrad, skills, email, resumeUrl, instagramLink, linkedInLink, xLink } = await req.json();

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }

        const existingUser = await client.user.findUnique({
            where: { userId: userId },
        });

        if (!existingUser) {
            return new NextResponse("User Not Found", { status: 404 });
        }

        // Update the user data
        const updateUser = await client.user.update({
            where: {
                userId: userId,
            },
            data: {
                name: name,
                bio: bio,
                EducationLevel: educationLevel,
                InstitutionName: institutionName,
                GraduationDate: yearOfGrad,
                skills: skills,
                email: email,
                resume: resumeUrl,
                instagramLink: instagramLink,
                linkedInLink: linkedInLink,
                xLink: xLink,
            }
        });

        return NextResponse.json(updateUser);
    } catch (error) {
        console.log("[USER UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}