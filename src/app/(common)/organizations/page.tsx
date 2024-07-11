'use client';

import React from 'react';

import SearchOrganizationsPage from './_components/SearchOrganizations';
import { Spinner } from '@/components/spinner';
import ErrorCard from '@/components/displays/ErrorCard';
import useAllOrganizations from '@/hooks/companies/useAllCompanies';



const AllOrganizationPage = () => {

    const { organizations, loading, error } = useAllOrganizations();

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
            <SearchOrganizationsPage companies={organizations} />
        </div>
    );
}

export default AllOrganizationPage;