"use client"

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

import AllProjectsCard from '@/components/displays/AllProjectsCard';
import useAllProjects from '@/hooks/projects/useProjects';
import { Spinner } from '@/components/spinner';
import ErrorCard from '@/components/displays/ErrorCard';


const AllProjects = () => {

    const { projects, loading, error} = useAllProjects();

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return (
            <ErrorCard message={error}/>
        )
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