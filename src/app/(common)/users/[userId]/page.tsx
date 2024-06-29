import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import Link from 'next/link';

import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ArrowBigRight, BadgeCheckIcon, CalendarIcon, DownloadCloudIcon, FileIcon, LinkIcon, Mail } from 'lucide-react';

import { SocialIcon } from 'react-social-icons';
import { client } from '@/lib/prisma';


const UserPublicPage = async ({
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

    const projects = await client.project.findMany({
        where: {
            userId: user?.userId,
        }
    })



    const certificates = await client.certificate.findMany({
        where: {
            userId: user?.userId,
        }
    });


    return (
        <div>
            <Breadcrumb className='mt-2 ml-10'>
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
                        <BreadcrumbPage>{user?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='py-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='font-bold flex'>
                            {user?.name}
                            <span className='ml-2'>{user?.verified && <BadgeCheckIcon />}</span>
                        </CardTitle>
                        <CardDescription>{user?.InstitutionName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='sm:flex-col space-x-1'>
                            {user?.skills ? user?.skills.split(',').map((skill, index) => (
                                <Badge key={index}>{skill.trim()}</Badge>
                            )) : (
                                <p className='text-sm text-muted'>No Skills Added</p>
                            )}
                        </div>
                        <div className='mt-4'>
                            <h2 className='font-semibold'>
                                Socials
                            </h2>
                            <div className='flex space-x-4 py-2'>
                                {user?.linkedInLink && (
                                    <SocialIcon url={user?.linkedInLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                )}
                                {user?.instagramLink && (
                                    <SocialIcon url={user?.instagramLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                )}
                                {user?.xLink && (
                                    <SocialIcon url={user?.xLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                )}
                                {user?.email && (
                                    <SocialIcon
                                        network='email'
                                        style={{ height: 40, width: 40 }}
                                        href={`mailto:${user?.email}`}
                                    />
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col mt-4 justify-center space-y-2 mb-4'>
                            {user?.bio && (
                                <>
                                    <div>
                                        <h2 className='font-semibold'>Bio:</h2>
                                        <ScrollArea className='h-[270px] lg:h-[200px] whitespace-pre-wrap font-light'>
                                            {user?.bio}
                                        </ScrollArea>
                                    </div>
                                    <Separator />
                                </>
                            )}
                            <div className='flex'>
                                <h2 className='font-semibold mr-2'>Education Level:</h2>
                                {user?.EducationLevel}
                            </div>
                            <Separator />
                            <div className='flex'>
                                <h2 className='font-semibold mr-2'>Graduation Date:</h2>
                                {user?.GraduationDate ? user.GraduationDate.toDateString() : 'N/A'}
                            </div>
                            <Separator />
                        </div>
                        {user?.resume ? (
                            <Link href={user?.resume} rel="noopener noreferrer" target="_blank">
                                <div className="flex items-center justify-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md mt-2">
                                    {user?.name}&apos;s Resume
                                    <DownloadCloudIcon className='h-5 w-5 ml-2' />
                                </div>
                            </Link>
                        ) : (
                            <div className='flex items-center justify-center h-16 bg-slate-100 rounded-md text-slate-400'>
                                <FileIcon className='h-5 w-5 text-slate-400 mr-2' />
                                No Resume Uploaded by {user?.name}
                            </div>
                        )}
                        <Separator className='mt-6' />
                        <h2 className='py-4 font-sans text-2xl'>{user?.name}&apos;s Projects</h2>
                        {projects && projects.length > 0 ? (
                            <div className='grid grid-cols-1 gap-4 mt-4'>
                                {projects.map((project: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4">
                                        {project.link ? ( // Check if project has a link
                                            <> {/* Wrap in Link if project has a link */}
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                    <Link href={project.link}>
                                                        <LinkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                    </Link>
                                                </div>
                                                <div className='w-32 lg:w-[800px]'>
                                                    <h3 className="text-lg font-semibold line-clamp-1 lg:line-clamp-none">{project.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                                                </div>
                                            </>
                                        ) : ( // Render just the div if project does not have a link
                                            <>
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                    <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <div className='w-32 lg:w-[800px]'>
                                                    <h3 className="text-lg font-semibold">{project.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                                                </div>
                                            </>
                                        )}
                                        <Link href={`/users/${userId}/${project.id}`} className='ml-auto'>
                                            <div className="h-auto w-auto items-center justify-center rounded-lg bg-purple-100 dark:bg-gray-800 text-sm px-2 lg:block hidden">
                                                Learn More
                                            </div>
                                            <div className="h-auto w-auto items-center justify-center rounded-lg bg-purple-100 dark:bg-gray-800 text-sm px-2 lg:hidden">
                                                <ArrowBigRight />
                                            </div>
                                        </Link>
                                    </div>

                                ))}
                            </div>
                        ) : (
                            <div className='flex items-center justify-center text-muted-foreground'>
                                No Projects Uploaded by {user?.name}
                            </div>
                        )}
                        <Separator className='mt-6' />
                        <h2 className='py-4 font-sans text-2xl'>{user?.name}&apos;s Certificates</h2>
                        {certificates && certificates.length > 0 ? (
                            <div className='grid grid-cols-1 gap-4 mt-4'>
                                {certificates.map((certificate: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                            <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div className='w-32 lg:w-[800px]'>
                                            <h3 className="text-lg font-semibold line-clamp-1 lg:line-clamp-none">{certificate.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{certificate.description}</p>
                                        </div>
                                        <Link href={`/users/${userId}/certificates/${certificate.id}`} className='ml-auto'>
                                            <div className="h-auto w-auto items-center justify-center rounded-lg bg-purple-100 dark:bg-gray-800 text-sm px-2 lg:block hidden">
                                                Learn More
                                            </div>
                                            <div className="h-auto w-auto items-center justify-center rounded-lg bg-purple-100 dark:bg-gray-800 text-sm px-2 lg:hidden">
                                                <ArrowBigRight />
                                            </div>
                                        </Link>
                                    </div>

                                ))}
                            </div>
                        ) : (
                            <div className='flex items-center justify-center text-muted-foreground'>
                                No Certificates Uploaded by {user?.name}
                            </div>
                        )}
                        <Separator className='mt-6' />
                    </CardContent>
                    <CardFooter>
                        <Button
                            className='flex'
                        >
                            <Link href={`mailto:${user?.email}`}>
                                Email Me
                            </Link>
                            <Mail className='ml-1 h-5 w-5' />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default UserPublicPage