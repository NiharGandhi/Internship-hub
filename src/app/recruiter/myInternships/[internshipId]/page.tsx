import UpdateStatusButton from '@/components/buttons/UpdateStatusButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { client } from '@/lib/prisma';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { MessageCircle } from 'lucide-react';

const ApplicationPage = async ({ params } : { params: any }) => {
    const { internshipId } = params;

    const applications = await client.application.findMany({
        where: {
            internshipId: internshipId,
        },
        include: {
            user: true, // Include user data
        },
    });

    const internshipData = await client.createInternship.findUnique({
        where: {
            id: internshipId,
        },
    });

    const formatDate = (dateString: string | number | Date | null) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMMM yyyy');
    };

    return (
        <div className='px-4'>
            <Breadcrumb className='mt-2 py-2'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/myInternships">My Internships</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{internshipData?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='font-bold text-4xl mt-4'>Applications for Internship {internshipData?.name}</h1>
            <div className='mt-8'>
                {applications.length > 0 ? (
                    <>
                        {applications.map(app => (
                            <Card key={app.id} className='mb-4'>
                                <CardHeader>
                                    <CardTitle className='font-bold'>{app.user.name}</CardTitle>
                                    <CardDescription>{app.user.InstitutionName}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex flex-col justify-center space-y-2'>
                                        <div className='sm:flex-col space-x-1'>
                                            <p className='text-muted-foreground'>Skills:</p>
                                            {app.user.skills ? app.user.skills.split(",").map((skill, index) => (
                                                <Badge key={index}>{skill.trim()}</Badge>
                                            )) : (
                                                <p className='text-sm text-muted'>No Skills Added</p>
                                            )}
                                        </div>
                                        <div className='flex'>
                                            <p className='text-muted-foreground'>Education Level:</p>
                                            <div className='ml-1 font-semibold'>
                                                {app.user.EducationLevel}
                                            </div>
                                        </div>
                                        <div className='flex'>
                                            <p className='text-muted-foreground'>Graduation Date:</p>
                                            <div className='ml-1 font-semibold'>
                                                {formatDate(app.user.GraduationDate)}
                                            </div>
                                        </div>
                                        <div className='flex'>
                                            <p className='text-muted-foreground'>Email:</p>
                                            <div className='ml-1 font-semibold'>
                                                {app.user.email}
                                            </div>
                                        </div>
                                        {app.user.resume ? (
                                            <div className='flex'>
                                                <p className='text-muted-foreground'>Resume:</p>
                                                <div className='ml-1 font-semibold'>
                                                    <Link href={app.user.resume}>
                                                        <Badge className='bg-emerald-300 text-black'>
                                                            {app.user.name}&apos;s Resume
                                                        </Badge>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='flex'>
                                                <p className='text-muted-foreground'>Resume:</p>
                                                <div className='ml-1 font-semibold'>
                                                    <Badge className='bg-emerald-300 text-black hover:text-white'>
                                                        No Resume
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                        <div className='flex'>
                                            <p className='text-muted-foreground'>User&apos;s profile:</p>
                                            <div className='ml-1'>
                                                <Link href={`/users/${app.user.id}`}>
                                                    <Badge>Visit Profile</Badge>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    Status:
                                    {app.user.email && internshipData?.name && (
                                        <UpdateStatusButton applicationId={app.id} userEmail={app.user.email} userName={app.user.name} internshipName={internshipData.name} />
                                    )}
                                    <Link href={`/recruiter/message/${app.id}`} className='ml-auto'>
                                        <Button>
                                            <MessageCircle />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                        }
                    </>
                ) : (
                    <div>
                            <div className='py-4 px-8'>
                                <div className='flex flex-col items-center justify-center text-muted-foreground text-xl lg:text-4xl space-y-4'>
                                    <h1>No Applications Received.</h1>
                                </div>
                            </div>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default ApplicationPage;
