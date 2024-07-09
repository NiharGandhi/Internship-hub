import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import Link from 'next/link';

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

import {  DownloadCloudIcon, FileIcon, InfoIcon } from 'lucide-react';
import { client } from '@/lib/prisma';
import { cn } from '@/lib/utils';

const PublicCertificatePage = async ({
    params
}: {
    params: { certificateId: string }
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const certificate = await client.certificate.findUnique({
        where: {
            id: params?.certificateId,
        }
    });

    const user = await client.user.findUnique({
        where: {
            userId: certificate?.userId
        }
    })

    if (!certificate) {
        return redirect("/dashboard");
    }

    console.log(certificate.certificateUrl);

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
                        <BreadcrumbPage>{certificate.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div>
                <div className='flex items-center'>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <InfoIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h1 className='font-bold text-2xl lg:text-4xl'>{certificate.name}</h1>
                </div>
                <div className={cn('w-full grid grid-cols-1 xl:grid-cols-2 mt-6', !certificate.certificateUrl && "w-full flex mt-6")}>
                    <div className='mt-4 lg:px-10 xl:px-2'>
                        <h2 className='text-2xl font-semibold'>Description</h2>
                        <p className='whitespace-pre-wrap'>{certificate.description}</p>
                        {certificate.link && (
                            <div className='my-2'>
                                <h2 className='text-2xl font-semibold'>Link</h2>
                                <div className="rounded-lg hover:text-blue-500 hover:underline w-auto">
                                    <Link href={certificate.link} rel="noopener noreferrer" target="_blank">
                                        <p className='overflow-clip'>{certificate.link}</p>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                    {(certificate.certificateUrl) && (
                        <Link href={certificate.certificateUrl} rel="noopener noreferrer" target="_blank">
                            <div className="flex items-center justify-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md mt-6">
                                <DownloadCloudIcon className='h-5 w-5 mr-2' />
                                {certificate.name} Certification
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default PublicCertificatePage;
