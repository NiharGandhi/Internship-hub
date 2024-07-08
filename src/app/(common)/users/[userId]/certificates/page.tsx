import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import Link from 'next/link';

import React from 'react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { client } from '@/lib/prisma';
import ProjectCard from '@/components/displays/ProjectCard';


const ProjectsPage = async ({
    params
}: {
    params: { userId: string }
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const user = await client.user.findUnique({
        where: {
            id: params.userId,
        }
    })

    const certificates = await client.certificate.findMany({
        where: {
            userId: user?.userId,
        }
    })


    return (
        <div>
            <Breadcrumb className='mt-2'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/users">Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/users/${user?.id}`}>{user?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Certificates</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='py-4'>
                <Card>
                    <CardHeader className='flex flex-col lg:flex-row gap-2'>
                        <div>
                            <CardTitle className='font-bold flex'>
                                {user?.name}&apos;s Certificates
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {certificates && certificates.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {certificates.map((project: any, index: number) => (
                                    <ProjectCard project={project} key={index} />

                                ))}
                            </div>
                        ) : (
                            <div className='flex items-center justify-center text-muted-foreground'>
                                No Certificates Uploaded by {user?.name}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProjectsPage