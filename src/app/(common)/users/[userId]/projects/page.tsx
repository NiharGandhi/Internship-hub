"use client";

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

import ProjectCard from '@/components/displays/ProjectCard';
import useUserDetail from '@/hooks/users/useUserDetails';
import { Spinner } from '@/components/spinner';
import ErrorCard from '@/components/displays/ErrorCard';
import { redirect } from 'next/navigation';


const ProjectsPage = ({
    params
}: {
    params: { userId: string }
}) => {

    const {user, userProjects: projects, loading, error} = useUserDetail({ userId: params.userId })

    if (loading) {
        return <Spinner/>
    }

    if (error) {
        return <ErrorCard message={error} />
    }

    if (!user) {
        redirect("/")
    }

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
                        <BreadcrumbPage>Projects</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='py-4'>
                <Card>
                    <CardHeader className='flex flex-col lg:flex-row gap-2'>
                        <div>
                            <CardTitle className='font-bold flex'>
                                {user?.name}&apos;s Projects
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {projects && projects.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                                {projects.map((project: any, index: number) => (
                                    <ProjectCard project={project} key={index} id={user!.id} />

                                ))}
                            </div>
                        ) : (
                            <div className='flex items-center justify-center text-muted-foreground'>
                                No Projects Uploaded by {user?.name}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProjectsPage