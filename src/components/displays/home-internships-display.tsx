"use client";

import React, { useEffect, useState } from 'react';
import { client } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';


const DisplayInternshipsPage = ({ internships }: { internships: any }) => {
    return (
        <div>            
            <div className='space-y-4'>
                <ScrollArea className="w-80 md:w-[700px] xl:w-[1200px] whitespace-nowrap rounded-md border">
                    <div className="flex w-max space-x-4 p-4">
                        {internships.map((internship: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; InternshipType: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; InternshipDescription: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
                            <Card key={internship.id} className='w-[300px]'>
                                <CardHeader>
                                    <div className='flex'>
                                        <div>
                                            <CardTitle className='font-bold'>{internship.name}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <div className='flex'>
                                            <p className='text-muted-foreground'>Mode: </p>
                                            <p className='ml-2 font-semibold'>{internship.InternshipType}</p>
                                        </div>
                                        <div>
                                            <p className='text-muted-foreground'>Description: </p>
                                            <p className='whitespace-pre-wrap line-clamp-3'>{internship.InternshipDescription}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link className='ml-auto mt-auto' href={`/internships/${internship.id}`}>
                                        <Button>
                                            Explore
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
};

export async function getServerSideProps() {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const internships = await client.createInternship.findMany({
        include: {
            user: true,
        }
    });

    return {
        props: { internships },
    };
}

export default DisplayInternshipsPage;
