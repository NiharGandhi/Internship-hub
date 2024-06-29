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
            <div className='lg:ml-2 lg:py-4 flex-col lg:flex-wrap'>
                <div className='flex-col lg:flex lg:flex-row'>
                    <div className='w-full lg:w-1/2 md:w-1/2 space-y-6'>
                        <div className='flex items-center mt-4 px-4'>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <InfoIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h1 className='font-bold text-2xl lg:text-4xl ml-2'>{certificate.name}</h1>
                        </div>
                        <div className='mt-4 px-4 '>
                            <h2 className='text-2xl font-semibold'>Certificate Attachment</h2>
                            {(certificate.certificateUrl) ? (
                                <Link href={certificate.certificateUrl} rel="noopener noreferrer" target="_blank">
                                    <div className="flex items-center justify-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md mt-2">
                                        <DownloadCloudIcon className='h-5 w-5 mr-2' />
                                        {certificate.name} Certification
                                    </div>
                                </Link>
                            ) : (
                                <div className='flex items-center justify-center h-16 bg-slate-100 rounded-md text-slate-400'>
                                    <FileIcon className='h-5 w-5 text-slate-400 mr-2' />
                                    No Certificate Attachment Uploaded. Upload Now!!!
                                </div>
                            )}
                            
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 md:w-1/2 space-y-6 lg:py-16'>
                        <div className='mt-4 px-4'>
                            <h2 className='text-2xl font-semibold'>Description</h2>
                            <ScrollArea className='h-[370px] py-2 px-2 rounded-lg whitespace-pre-wrap'>
                                {certificate.description}
                            </ScrollArea>
                        </div>
                        <div className='mt-4 px-4'>
                            <h2 className='text-2xl font-semibold'>Link</h2>
                            {certificate.link ? ( // Check if certificate has a link
                                <> {/* Wrap in Link if certificate has a link */}
                                    <div className="py-2 px-2 text-gray-800 bg-gray-100 rounded-lg hover:text-blue-500 hover:underline w-auto">
                                        <Link href={certificate.link} rel="noopener noreferrer" target="_blank">
                                            <p className='overflow-clip'>{certificate.link}</p>
                                        </Link>
                                    </div>
                                </>
                            ) : ( // Render just the div if certificate does not have a link
                                <>
                                    <div className='py-2 px-2 text-gray-800 bg-gray-100 rounded-lg'>
                                        <p>No Links</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicCertificatePage;
