"use client"

import React from 'react'

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
            <Breadcrumb className='mt-2 lg:ml-4'>
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
            <h1 className='font-bold text-4xl mt-2 lg:px-4'>Projects</h1>
            <div className='py-4'>
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
            </div>
        </div>
    )
}

export default AllProjects