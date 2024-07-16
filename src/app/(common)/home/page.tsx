'use client';

import ErrorCard from '@/components/displays/ErrorCard';
import EventCard from '@/components/displays/EventCard';
import ResourceCard from '@/components/displays/ResourceCard';
import DisplayInternshipsPage from '@/components/displays/home-internships-display';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useEvents from '@/hooks/events/useEvents';
import useAllInternships from '@/hooks/internships/useAllInternships';
import useOnlineResources from '@/hooks/resources/useOnlineResource';
import { Company, User } from '@/types/interfaces';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

const useUserData = (user: any) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [orgData, setOrgData] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState<string | undefined>("INTERNSHIP_FINDER");
    const [userName, setUserName] = useState<string | null>("");
    const [error, setError] = useState<string | null>(null);
    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get("/api/user");
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Error Fetching user data");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrgData = useCallback(async () => {
        try {
            const response = await axios.get("/api/myOrganization");
            setOrgData(response.data);
        } catch (error) {
            console.error("Error fetching organization data:", error);
            setError("Error Fetching Organization data.")
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            const userType = user.publicMetadata?.userType;
            setUserType(userType);

            if (userType === 'INTERNSHIP_FINDER') {
                fetchUserData();
            } else if (userType === 'RECRUITER') {
                fetchOrgData();
            } else {
                redirect('/');
            }
        }
    }, [user, fetchUserData, fetchOrgData]);

    useEffect(() => {
        if (userData) {
            setUserName(userData.name);
        } else if (orgData) {
            setUserName(orgData.name);
        } else {
            setUserName("")
        }
    }, [userData, orgData]);

    return { userName, userType, userData, orgData, loading, error };
};

const Home = () => {
    const { user, isLoaded } = useUser();
    const { events, error, loading } = useEvents();
    const { onlineResources, errorRes, loadingRes } = useOnlineResources();
    const { userName, userType, userData, orgData, loading: userLoading, error: userError } = useUserData(user);
    const { internships, loading: internshipsLoading, error: internshipError } = useAllInternships();

    if (userLoading || internshipsLoading || loading || loadingRes || !isLoaded) return <Spinner />

    if (error || errorRes || userError || internshipError) {
        return (
            <ErrorCard message={error || errorRes || userError || internshipError} />
        )
    }

    if (userType === "INTERNSHIP_FINDER" && userData === null && !userLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                    Please complete your profile to access the app&apos;s features.
                </p>
                <Link href="/intern/myProfile">
                    <Button>My Profile</Button>
                </Link>
            </div>
        );
    }

    if (userType === "RECRUITER" && orgData === null && !userLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                    Please complete your profile to access the app&apos;s features.
                </p>
                <Link href="/recruiter/myOrganization">
                    <Button>My Organization</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className='mt-4'>
                <span className='font-normal text-4xl'>Welcome <span className='font-semibold'>{userName}</span>👋</span>
            </div>
            <Card className='border-orange mt-4'>
                <CardHeader className='font-semibold text-2xl'>Internships</CardHeader>
                <CardContent>
                    <DisplayInternshipsPage internships={internships} />
                </CardContent>
            </Card>
            <Card className='border-orange mt-4'>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                        <ResourceCard
                            resources={onlineResources}
                            title='Online Resources'
                            cardDesc='Useful links and resources for interns'
                        />
                        <EventCard
                            events={events}
                            title='Upcoming Events'
                            desc='Events you may be interested in'
                            upcomingEventsActive
                            pastEventsActive={false}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Home;
