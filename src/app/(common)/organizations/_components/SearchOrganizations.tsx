"use client";

import React, { useEffect, useState } from 'react';

import { client } from '@/lib/prisma';

import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import Link from 'next/link';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import LogoFallBack from "../../../../../public/images/CompanyLogoFallback.svg";

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown } from 'lucide-react';

const SearchOrganizationsPage = ({ companies }: { companies: any }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [companiesPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [locations, setLocations] = useState<string[]>([]);
    const [openLocation, setOpenLocation] = useState(false);

    // Extract all unique values for locations
    useEffect(() => {
        const allLocations: Set<string> = new Set();

        companies.forEach((company: { Location: string }) => {
            if (company.Location) {
                allLocations.add(company.Location);
            }
        });

        setLocations(Array.from(allLocations));
    }, [companies]);

    const filteredCompanies = companies.filter((company: { name: string; Location: string; CompanyDescription: string }) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedLocation === '' || company.Location === selectedLocation)
    );

    const indexOfLastCompany = currentPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

    const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleLocationChangeCombobox = (value: string) => {
        setSelectedLocation(value);
        setCurrentPage(1);
        setOpenLocation(false);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredCompanies.length / companiesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const clearFilters = () => {
        setSelectedLocation('');
        setCurrentPage(1);
    };

    return (
        <div>
            <Breadcrumb className='mt-3 lg:ml-10'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Organizations</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='font-bold text-4xl mt-2 lg:px-10'>Organizations</h1>
            <div className='py-4 lg:px-8 space-y-4 space-x-4'>
                {/* Search Bar */}
                <div className='flex items-center space-x-2'>
                    <Input
                        type="text"
                        placeholder="🔎 Search organizations..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                {/* Location Combobox */}
                <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openLocation}
                            className="justify-between"
                        >
                            {selectedLocation || "All Locations"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Command>
                            <CommandInput
                                placeholder="Location..."
                                onInput={(e) => setSelectedLocation(e.currentTarget.value)}
                            />
                            <CommandEmpty>No Locations Found</CommandEmpty>
                            <CommandList>
                                {locations.map(location => (
                                    <CommandItem
                                        key={location}
                                        onSelect={() => handleLocationChangeCombobox(location)}
                                    >
                                        {location}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
                {/* Company Cards */}
                {currentCompanies.map((company: { id: React.Key | null | undefined; name: string; Location: string; CompanyDescription: string; CompanyLogoUrl: string; }) => (
                    <div key={company.id} className='py-2'>
                        <Link href={`/organizations/${company.id}`}>
                            <Card className=''>
                                <CardHeader className='font-bold text-4xl'>
                                    <div className='flex'>
                                        <Image
                                            src={company?.CompanyLogoUrl || LogoFallBack}
                                            alt='Logo'
                                            width={50}
                                            height={50}
                                            className='h-[50px]'
                                        />
                                        <div className='ml-4'>
                                            <CardTitle>{company.name}</CardTitle>
                                            <CardDescription>
                                                {company.Location}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <p className='text-muted-foreground'>About Us:</p>
                                    </div>
                                    <p className='rounded-lg whitespace-pre-wrap line-clamp-3'>
                                        {company.CompanyDescription}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                ))}
                {/* Pagination Controls */}
                <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
                    <span className='py-2'>Page {currentPage} of {Math.ceil(filteredCompanies.length / companiesPerPage)}</span>
                    <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredCompanies.length / companiesPerPage)}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps() {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const companies = await client.company.findMany();

    return {
        props: { companies },
    };
}

export default SearchOrganizationsPage;
