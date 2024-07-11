'use client';
import React from 'react';
import SearchInternshipsPage from './_components/SearchInternships';
import useInternships from '@/hooks/internships/useInternships';
import { Spinner } from '@/components/spinner';
import ErrorCard from '@/components/displays/ErrorCard';



const InternshipsPage = () => {

    const {internships, loading, error} = useInternships();

    if (loading) {
        return <Spinner />
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