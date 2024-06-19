import { client } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import React from 'react';

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
import { Separator } from '@/components/ui/separator';

import { ArrowLeft } from 'lucide-react';

import CompanyLogo from "../../../../../public/images/CompanyLogoFallback.svg";
import CompanyBanner from "../../../../../public/images/CompanyBannerFallback.png";

import { cn } from '@/lib/utils';



const OrganizationPage = async ({ params } : { params : {
    organizationId : string
} }) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const id = params.organizationId;

    const company = await client.company.findUnique({
        where: {
            id: id,
        },
    });

    const internships = await client.createInternship.findMany({
        where: {
            userId: company?.userId
        }
    });

    return (
        <div>
            <div style={{ position: 'relative' }}>
                <Image
                    src={company?.CompanyImageUrl || CompanyBanner}
                    alt='Banner'
                    width={1244}
                    height={200}
                    className='h-[200px] rounded-xl'
                />
                <div style={{ position: 'absolute', top: 5, left: 10 }} className='bg-slate-200 rounded-lg'>
                    <Link href={"/organizations"}>
                        <ArrowLeft className='text-black' />
                    </Link>
                </div>
                <div style={{ position: 'absolute', top: 150, left: 20 }}>
                    <Image
                        src={company?.CompanyLogoUrl || CompanyLogo}
                        alt='Logo'
                        width={100}
                        height={100}
                        className={cn("h-[100px] rounded-md", CompanyLogo && "bg-gray-300 rounded-xl opacity-100")}
                    />
                </div>
            </div>
            <div className='px-10 space-y-2 lg:mt-4 lg:ml-24 mt-16'>
                <h1 className='font-bold text-4xl'>{company?.name}</h1>
                <Badge>{company?.Location}</Badge>
                <Separator />
                <div>
                    <h2 className='text-2xl font-semibold mt-6'>About Us</h2>
                    <p className='text-muted-foreground rounded-lg whitespace-pre-wrap'>
                        {company?.CompanyDescription}
                    </p>
                </div>
            </div>
            <div className='px-10 space-y-2 lg:mt-6 lg:ml-24 mt-16'>
                <h1 className='font-bold text-3xl mt-6'>Internships at <span className='text-orange'>{company?.name}</span></h1>
                <div>
                    {internships.map(internship => (
                        <Card key={internship.id} className='mb-4'>
                            <CardHeader>
                                <CardTitle className='font-bold'>{internship.name}</CardTitle>
                                <CardDescription>{company?.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <div className='flex'>
                                        <p className='text-muted-foreground'>Mode: </p>
                                        <p className='ml-2 font-semibold'>{internship.InternshipType}</p>
                                    </div>
                                    <div>
                                        <p className='text-muted-foreground'>Description: </p>
                                        <p className='whitespace-pre-wrap'>{internship.InternshipDescription}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link className='ml-auto' href={`/internships/${internship.id}`}>
                                    <Button>
                                        Explore
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrganizationPage;