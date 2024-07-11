'use client';

import DisplayInternshipsPage from '@/components/displays/home-internships-display';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import HeroImage from "../../public/images/placeholder.png";


const Home = () => {
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

    if (loading) return <Spinner />;

    return (
        <div>
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
                                width={550}
                                height={310}
                            />
                        </div>
                    </div>
                </section>
            </main>
            <Card className='border-orange mt-4 w-[350px] lg:w-full'>
                <CardHeader className='font-semibold text-2xl'>
                    Internships
                </CardHeader>
                <CardContent>
                    <DisplayInternshipsPage internships={internshipsData} />
                </CardContent>
            </Card>
        </div>
    );
}

export default Home;
