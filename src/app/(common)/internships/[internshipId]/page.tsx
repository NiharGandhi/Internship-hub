import { client } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

import ApplyButton from '@/components/buttons/ApplyButton';

import Image from 'next/image';
import Link from 'next/link';

import FallBack from "../../../../../public/images/fallback.png";
import { Separator } from '@/components/ui/separator';

const SelectedInternshipPage = async ({
    params
}: {
    params: { internshipId: string }
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const user = await client.user.findUnique({
        where: {
            userId: userId
        }
    })

    const internship = await client.createInternship.findUnique({
        where: {
            id: params.internshipId,
        }
    })

    const company = await client.company.findUnique({
        where: {
            userId: internship?.userId
        }
    })

    return (
        <div>
            <Breadcrumb className='mt-2 ml-10'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/internships">Internships</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{internship?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div style={{ position: 'relative' }} className='mt-4'>
                <Image
                    src={company?.CompanyImageUrl || FallBack}
                    alt='Banner'
                    width={1244}
                    height={396}
                    className='h-[200px] w-full md:w-[750px] xl:w-[1244px] rounded-xl'
                />
                <div style={{ position: 'absolute', top: 150, left: 20 }}>
                    <Image
                        src={company?.CompanyLogoUrl || FallBack}
                        alt='Logo'
                        width={100}
                        height={100}
                        className='h-[100px] rounded-xl'
                    />
                </div>
            </div>
            <div className='px-2 xl:px-10 space-y-2 xl:mt-4 xl:ml-24 mt-16'>
                {/* <Link href={`/organizations/${company?.id}`}>
                    <h1 className='font-bold text-4xl'>{company?.name}</h1>
                </Link> */}
                <Separator />
                <div className='py-4'>
                    <Card className='w-full'>
                        <CardHeader>
                            <CardTitle className='font-bold'>{internship?.name}</CardTitle>
                            <CardDescription>{company?.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col justify-center'>
                                <div className='py-1'>
                                    <p className='text-muted-foreground'>Internship Mode:</p>
                                    <p className='font-semibold'>{internship?.InternshipType}</p>
                                </div>
                                <div className='py-1'>
                                    <p className='text-muted-foreground'>Education Level:</p>
                                    <p className='font-semibold'>{internship?.EducationLevel}</p>
                                </div>
                                <div className='py-1'>
                                    <p className='text-muted-foreground'>Internship Description:</p>
                                    <p className='font-semibold whitespace-pre-wrap'>{internship?.InternshipDescription}</p>
                                </div>
                                <div className='py-1'>
                                    <p className='text-muted-foreground'>Internship Requirements:</p>
                                    <p className='font-semibold whitespace-pre-wrap'>{internship?.InternshipRequirement}</p>
                                </div>
                                {internship?.Paid && (
                                    <div className='flex py-1'>
                                        <p className='text-muted-foreground'>Pay:</p>
                                        <p className='ml-2 font-semibold whitespace-pre-wrap'>{internship?.AmountPaid}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className='space-x-2'>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button>Contact</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 px-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Email ID</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {company?.email}
                                            </p>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <ApplyButton user={user} company={company} internship={internship} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default SelectedInternshipPage