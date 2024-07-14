'use client';
import React from 'react';
import SearchInternshipsPage from './_components/SearchInternships';
import useInternships from '@/hooks/internships/useInternships';
import { Spinner } from '@/components/spinner';
import ErrorCard from '@/components/displays/ErrorCard';
import { useUser } from '@clerk/nextjs';
import NoUserCard from '@/components/displays/NoUser';
import DisplayInternshipsPage from '@/components/displays/home-internships-display';
import PublicInternshipsPage from './_components/PublicInternships';



const InternshipsPage = () => {

    const { user, isLoaded } = useUser();

    const {internships, loading, error} = useInternships();

    if (loading && !isLoaded) {
        return <Spinner />
    }

    if (!user) {
        return (
            <PublicInternshipsPage internships={internships} />
        )
    }

    if (error) {
        return (
            <ErrorCard message={error} />
        )
    }

    return (
        <div>
            {internships ? (
                <SearchInternshipsPage internships={internships} />
            ) : (
                <div className='items-center justify-center'>
                    <p>No Internships Available Right Now</p>
                </div>
            )}
        </div>
    );
}

export default InternshipsPage;