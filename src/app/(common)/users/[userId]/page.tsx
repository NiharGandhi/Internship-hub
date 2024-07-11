"use client";

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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {  BadgeCheckIcon, DownloadCloudIcon, FileIcon, Mail } from 'lucide-react';

import { SocialIcon } from 'react-social-icons';
import ConnectionButton from '@/components/buttons/ConnectButton';
import useUserDetail from '@/hooks/users/useUserDetails';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/spinner';
import ErrorCard from '@/components/displays/ErrorCard';
import ProjectCard from '@/components/displays/ProjectCard';
import CertificateCard from '@/components/displays/CertificateCard';
import { format } from 'date-fns';


const UserPublicPage = ({
    params
}: {
    params: { userId: string }
}) => {


    const { user: userDetails, userProjects, userCertificates, loading, error } = useUserDetail({ userId: params.userId })

    const { user, isLoaded } = useUser();

    if (loading || !isLoaded) {
        return <Spinner/>
    };

    if (!user) {
        redirect("/")
    };

    if (error) {
        return <ErrorCard message={error} />
    };

    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMMM yyyy');
    };


    const graduationDate = userDetails?.GraduationDate ? formatDate(userDetails.GraduationDate) : 'N/A';

    const displayedProjects = userProjects?.slice(0, 6);
    const displayedCertificates = userCertificates?.slice(0, 6);


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
                        <BreadcrumbPage>{userDetails?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='py-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='font-bold flex justify-between items-center'>
                            <div className='flex'>
                                {userDetails?.name}
                                <span className='ml-2'>{userDetails?.verified && <BadgeCheckIcon />}</span>
                            </div>
                            {userDetails && userDetails.id && userDetails?.userId && user?.id !== userDetails!.userId && (
                                <ConnectionButton targetUserId={userDetails!.id} knockReceiverId={userDetails!.userId} />
                            )}
                        </CardTitle>
                        <CardDescription>{userDetails?.InstitutionName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='sm:flex-col space-x-1'>
                            {userDetails?.skills ? userDetails?.skills.split(',').map((skill, index) => (
                                <Badge key={index}>{skill.trim()}</Badge>
                            )) : (
                                <p className='text-sm text-muted'>No Skills Added</p>
                            )}
                        </div>
                        <div className='mt-4'>
                            {userDetails?.linkedInLink && userDetails?.instagramLink && userDetails?.xLink && (
                                <h2 className='font-semibold'>
                                    Socials
                                </h2>
                            )}
                            <div className='flex space-x-4 py-2'>
                                {userDetails?.linkedInLink && (
                                    <SocialIcon url={userDetails?.linkedInLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                )}
                                {userDetails?.instagramLink && (
                                    <SocialIcon url={userDetails?.instagramLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                )}
                                {userDetails?.xLink && (
                                    <SocialIcon url={userDetails?.xLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                )}
                                {userDetails?.email && (
                                    <SocialIcon
                                        network='email'
                                        style={{ height: 40, width: 40 }}
                                        href={`mailto:${userDetails?.email}`}
                                    />
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col mt-4 justify-center space-y-2 mb-4'>
                            {userDetails?.bio && (
                                <>
                                    <div>
                                        <h2 className='font-semibold'>Bio:</h2>
                                        <ScrollArea className='h-[270px] lg:h-[200px] whitespace-pre-wrap font-light'>
                                            {userDetails?.bio}
                                        </ScrollArea>
                                    </div>
                                </>
                            )}
                            <div className='flex'>
                                <h2 className='font-semibold mr-2'>Education Level:</h2>
                                {userDetails?.EducationLevel}
                            </div>
                            <div className='flex'>
                                <h2 className='font-semibold mr-2'>Graduation Date:</h2>
                                {graduationDate}
                            </div>
                            <Separator />
                        </div>
                        {userDetails?.resume ? (
                            <Link href={userDetails?.resume} rel="noopener noreferrer" target="_blank">
                                <div className="flex items-center justify-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md mt-2">
                                    {userDetails?.name}&apos;s Resume
                                    <DownloadCloudIcon className='h-5 w-5 ml-2' />
                                </div>
                            </Link>
                        ) : (
                            <div className='flex items-center justify-center h-16 bg-slate-100 rounded-md text-slate-400'>
                                <FileIcon className='h-5 w-5 text-slate-400 mr-2' />
                                    No Resume Uploaded by {userDetails?.name}
                            </div>
                        )}
                        <Separator className='mt-6' />
                        {displayedProjects && displayedProjects.length > 0 && (
                            <>
                                <div className='flex flex-col md:flex-row items-center justify-between'>
                                    <h2 className='py-4 font-sans text-2xl'>{userDetails?.name}&apos;s Projects</h2>
                                    <Link href={`/users/${userDetails?.id}/projects`} className='hover:scale-105 hover:text-cyan-500 transition-all'>
                                        All projects -{'>'}
                                    </Link>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                                    {userDetails && displayedProjects.map((project: any, index: number) => (
                                        <ProjectCard project={project} key={index} id={userDetails!.id} />

                                    ))}
                                </div>
                                <Separator className='mt-6' />
                            </>
                        )}
                        {displayedCertificates && displayedCertificates.length > 0 && (
                            <>
                                <div className='flex flex-col md:flex-row items-center justify-between'>
                                    <h2 className='py-4 font-sans text-2xl'>{userDetails?.name}&apos;s Certificates</h2>
                                    <Link href={`/users/${userDetails?.id}/certificates`} className='hover:scale-105 hover:text-cyan-500 transition-all'>
                                        All Certificates -{'>'}
                                    </Link>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    {userDetails && displayedCertificates.map((certificate: any, index: number) => (
                                        <CertificateCard certificate={certificate} key={index} id={userDetails.id}/>

                                    ))}
                                </div>
                                <Separator className='mt-6' />
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className='flex'
                        >
                            <Link href={`mailto:${userDetails?.email}`}>
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