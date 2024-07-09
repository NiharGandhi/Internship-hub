import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from '@/components/ui/scroll-area';

import { InfoIcon } from 'lucide-react';

import FallBack from "../../../../../../../public/images/fallback.png";
import { client } from '@/lib/prisma';
import { cn } from '@/lib/utils';


const PublicProjectPage = async ({
    params
}: {
    params: { projectId: string }
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const project = await client.project.findUnique({
        where: {
            id: params?.projectId,
        }
    });

    const user = await client.user.findUnique({
        where: {
            userId: project?.userId
        }
    })

    if (!project) {
        return redirect("/dashboard");
    }

    const fallbackImageUrl = FallBack; 

    console.log(project.imageUrl);

    return (
        <>
            <Breadcrumb className='mt-2 ml-4'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/users/${user?.id}`}>{user?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{project.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className=''>
                <div className='flex items-center'>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <InfoIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h1 className='font-bold text-2xl lg:text-4xl'>{project.name}</h1>
                </div>
                <div className={cn('w-full grid grid-cols-1 xl:grid-cols-2', !project.imageUrl && "w-full flex")}>
                    {project.imageUrl && (
                        <div>
                            <Image
                                src={project.imageUrl}
                                alt="Hero"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                className='rounded-xl p-2'
                                width={550}
                                height={325}
                            />
                        </div> 
                    )}
                    <div className='mt-4 lg:px-10 xl:px-2'>
                        <h2 className='text-2xl font-semibold'>Description</h2>
                        {project.description}
                        {project.link && (
                            <div className='my-2'>
                                <h2 className='text-2xl font-semibold'>Link</h2>
                                <div className="rounded-lg hover:text-blue-500 hover:underline w-auto">
                                    <Link href={project.link} rel="noopener noreferrer" target="_blank">
                                        <p className='overflow-clip'>{project.link}</p>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicProjectPage;
