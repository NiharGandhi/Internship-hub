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
import AllProjectsCard from '@/components/displays/AllProjectsCard';


const AllProjects = async ({
    params
}: {
    params: { userId: string }
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const projects = await client.project.findMany({
        include: {
            user: true,
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
                        <BreadcrumbPage>Projects</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='py-4'>
                <Card>
                    <CardHeader className='flex flex-col lg:flex-row gap-2'>
                        <div>
                            <CardTitle className='font-bold flex'>
                                Projects
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {projects && projects.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                                {projects.map((project: any, index: number) => (
                                    <AllProjectsCard project={project} key={index} />

                                ))}
                            </div>
                        ) : (
                            <div className='flex items-center justify-center text-muted-foreground'>
                                No Projects Uploaded
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AllProjects