'use client';

import EventCard from '@/components/displays/EventCard';
import ResourceCard from '@/components/displays/ResourceCard';
import DisplayInternshipsPage from '@/components/displays/home-internships-display';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useEvents from '@/hooks/events/useEvents';
import useOnlineResources from '@/hooks/resources/useOnlineResource';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Home = () => {

    const { user, isLoaded } = useUser();

    const { events } = useEvents();
    const { onlineResources } = useOnlineResources();

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>();
    const [orgData, setOrgData] = useState<any>();
    const [internshipsData, setInternshipsData] = useState<any>([]);

    useEffect(() => {
        if (user) {
            const userType = user.publicMetadata?.userType;

            // Redirect or manage access based on userType
            if (userType === 'INTERNSHIP_FINDER') {
                fetchUserData();
            } else if (userType === 'RECRUITER') {
                fetchOrgData();
            } else {
                redirect('/'); // Handle unexpected user types
            }
        }
    }, [user]);


    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/user");
            setUserData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
        }
    };
    
    const fetchOrgData = async () => {
        try {
            const response = await axios.get("/api/myOrganization");
            setOrgData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchInternshipData = async () => {
            try {
                const response = await axios.get("/api/allInternships");
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


    if (userData === null && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">Please complete your profile to access the app&apos;s features.</p>
                <Link href="/intern/myProfile">
                    <Button>My Profile</Button>
                </Link>
            </div>
        );
    }

  return (
    <div>
        <div className='mt-4'>
            <span className='font-normal text-4xl'>Welcome 👋</span>
        </div>
        <Card className='border-orange mt-4'>
            <CardHeader className='font-semibold text-2xl'>
                Internships
            </CardHeader>
            <CardContent>
                <DisplayInternshipsPage internships={internshipsData} />
            </CardContent>
        </Card>
          <Card className='border-orange mt-4'>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 py-4">
                    <ResourceCard resources={onlineResources} title='Online Resouces' cardDesc='Useful links and resources for interns' />
                    <EventCard events={events} title='Upcoming Events' desc='Events you may be interested in' upcomingEventsActive pastEventsActive={false} />
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default Home