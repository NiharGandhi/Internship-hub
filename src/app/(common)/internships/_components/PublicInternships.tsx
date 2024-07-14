"use client";

import React, { useEffect, useState } from 'react';
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';

import Image from 'next/image';
import FallBackUrl from "../../../../../public/images/CompanyLogoFallback.svg";
import { ChevronsUpDown } from 'lucide-react';

const PublicInternshipsPage = ({ internships } : { internships : any }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [internshipsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    const [organizations, setOrganizations] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [openOrganization, setOpenOrganization] = useState(false);
    const [openType, setOpenType] = useState(false);
    const [openLocation, setOpenLocation] = useState(false);

    // Extract all unique values for types and organizations
    useEffect(() => {
        const allTypes: Set<string> = new Set();
        const allOrganizations: Set<string> = new Set();
        const allLocations: Set<string> = new Set();

        internships.forEach((internship: { InternshipType: string; user: { name: string, Location : string } }) => {
            // Extract types
            if (internship.InternshipType) {
                allTypes.add(internship.InternshipType);
            }
            // Extract organizations
            if (internship.user.name) {
                allOrganizations.add(internship.user.name);
            }
            // Extract Location
            if (internship.user.Location) {
                allLocations.add(internship.user.Location);
            }
        });

        setTypes(Array.from(allTypes));
        setOrganizations(Array.from(allOrganizations));
        setLocations(Array.from(allLocations));
    }, [internships]);

    const filteredInternships = internships.filter((internship: { name: string; InternshipType: string; user: { name: string, Location : string }; InternshipDescription: string }) =>
        internship.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedType === '' || internship.InternshipType === selectedType) &&
        (selectedOrganization === '' || internship.user.name === selectedOrganization) &&
        (selectedLocation === '' || internship.user.Location === selectedLocation)
    );

    const indexOfLastInternship = currentPage * internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
    const currentInternships = filteredInternships.slice(indexOfFirstInternship, indexOfLastInternship);

    const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleTypeChange = (value: React.SetStateAction<string>) => {
        setSelectedType(value);
        setCurrentPage(1);
    };

    const handleOrganizationChange = (value: string) => {
        setSelectedOrganization(value);
        setCurrentPage(1);
    };

    const handleLocationChange = (value: React.SetStateAction<string>) => {
        setSelectedLocation(value);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredInternships.length / internshipsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const clearFilters = () => {
        setSelectedType('');
        setSelectedOrganization('');
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
                        <BreadcrumbPage>Internships</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='font-bold text-4xl mt-2 lg:px-10'>Internships</h1>
            <div className='py-4 lg:px-8 space-y-4 space-x-4'>
                {/* Search Bar */}
                <Input
                    type="text"
                    placeholder="🔎 Search internships..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {/* Filter Dropdowns */}
                <Popover open={openType} onOpenChange={setOpenType}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openType}
                            className="justify-between"
                        >
                            {selectedType || "All Types"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Command>
                            <CommandInput
                                placeholder="Type..."
                                onInput={(e) => setSelectedType(e.currentTarget.value)}
                            />
                            <CommandEmpty>No Types Found</CommandEmpty>
                            <CommandList>
                                {types.map(type => (
                                    <CommandItem
                                        key={type}
                                        onSelect={() => handleTypeChange(type)}
                                    >
                                        {type}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover> 
                <Popover open={openOrganization} onOpenChange={setOpenOrganization}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openOrganization}
                            className="justify-between"
                        >
                            {selectedOrganization || "All Organizations"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Command>
                            <CommandInput
                                placeholder="Organization..."
                                onInput={(e) => setSelectedOrganization(e.currentTarget.value)}
                            />
                            <CommandEmpty>No Organizations Found</CommandEmpty>
                            <CommandList>
                                {organizations.map(org => (
                                    <CommandItem
                                        key={org}
                                        onSelect={() => handleOrganizationChange(org)}
                                    >
                                        {org}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover> 
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
                                {locations.map(loc => (
                                    <CommandItem
                                        key={loc}
                                        onSelect={() => handleLocationChange(loc)}
                                    >
                                        {loc}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover> 
                <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
                {/* Internship Cards */}
                {currentInternships.map((internship: { id: React.Key | null | undefined; name: string; InternshipType: string; InternshipDescription: string; user: { id: string; name: string; CompanyLogoUrl: string } }) => (
                    <Card key={internship.id} className='mb-4 hover:shadow-md'>
                        <CardHeader>
                            <div className='flex'>
                                <div>
                                    <CardTitle className='font-bold'>{internship.name}</CardTitle>
                                    <CardDescription>
                                        <Link href={`/organizations/${internship.user.id}`}>
                                            {internship.user.name}
                                        </Link>
                                    </CardDescription>
                                </div>
                                <div className='ml-auto'>
                                    <Image
                                        src={internship.user.CompanyLogoUrl || FallBackUrl}
                                        alt='Logo'
                                        width={70}
                                        height={70}
                                        className='h-[70px]'
                                    />
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
                            <Link className='ml-auto' href={`/internships/${internship.id}`}>
                                <Button>
                                    Explore
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {/* Pagination Controls */}
                <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
                    <span className='py-2'>Page {currentPage} of {Math.ceil(filteredInternships.length / internshipsPerPage)}</span>
                    <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredInternships.length / internshipsPerPage)}>Next</Button>
                </div>
            </div>
        </div>
    );
};


export default PublicInternshipsPage;
