'use client';

import EventCard from '@/components/displays/EventCard';
import ResourceCard from '@/components/displays/ResourceCard';
import DisplayInternshipsPage from '@/components/displays/home-internships-display';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useEvents from '@/hooks/events/useEvents';
import useOnlineResources from '@/hooks/resources/useOnlineResource';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { CheckIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import HeroImage from "../../../public/images/placeholder.png";
import FetaureImage from "../../../public/images/features.jpeg";

const Home = () => {

    const { events } = useEvents();
    const { onlineResources } = useOnlineResources();

    const [loading, setLoading] = useState(true);
    const [internshipsData, setInternshipsData] = useState<any>([]);

    useEffect(() => {
        const fetchInternshipData = async () => {
            try {
                const response = await axios.get("/api/landingPage");
                setInternshipsData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };
        fetchInternshipData();
    }, []);

    if (loading) return <Spinner />


    return (
        <div>
            <div className='mt-4'>
                <span className='font-normal text-4xl'>Welcome 👋</span>
            </div>
            <Card className='border-orange mt-4 w-[350px] lg:w-full'>
                <CardHeader className='font-semibold text-2xl'>
                    Internships
                </CardHeader>
                <CardContent>
                    <DisplayInternshipsPage internships={internshipsData} />
                </CardContent>
            </Card>
            <main className="flex-1">
                <section className="py-12">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Find your dream internship with InternVista
                                    </h1>
                                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                        InternVista is the ultimate platform for students to showcase their profiles and connect with top
                                        employers for internship opportunities.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        href="/auth/sign-up"
                                    >
                                        <Button>Sign Up</Button>
                                    </Link>
                                </div>
                            </div>
                            <Image
                                src={HeroImage}
                                alt="Hero"
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center w-full lg:order-last"
                                width={"550"}
                                height={"310"}
                            />
                        </div>
                    </div>
                </section>
            </main>
            {/* <Card className='border-orange mt-4'>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 py-4">
                        <ResourceCard resources={onlineResources} title='Online Resouces' cardDesc='Useful links and resources for interns' />
                        <EventCard events={events} title='Upcoming Events' desc='Events you may be interested in' upcomingEventsActive pastEventsActive={false} />
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}

export default Home