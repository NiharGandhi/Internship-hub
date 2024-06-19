import { client } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { parse } from "url";

export async function GET(req: Request,) {
    try {
        const { userId } = auth();
        const { pathname } = parse(req.url);
        console.log(pathname)
        const certificateId = pathname?.split("/").pop();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const usersCertificate = await client.certificate.findUnique({
            where: {
                id: certificateId
            }
        })

        return NextResponse.json(usersCertificate);
    } catch (error) {
        console.log("ERROR API", error);
    }
}

export async function PUT(req: Request,) {
    try {
        const { userId } = auth();

        const { pathname } = parse(req.url);
        console.log(pathname)
        const certificateId = pathname?.split("/").pop();

        if (!userId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { name, description, link, certificateUrl } = await req.json();

        const newCertificate = await client.certificate.update({
            where: {
                id: certificateId
            },
            data: {
                userId: userId,
                name: name,
                description: description,
                link: link,
                certificateUrl: certificateUrl
            }
        })

        return NextResponse.json(newCertificate);
    } catch (error) {
        console.log("ERROR API", error);
    }
}