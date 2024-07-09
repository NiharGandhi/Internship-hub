"use client";

// SearchUsersPage.tsx
import { auth } from '@clerk/nextjs/server';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useToast } from '@/components/ui/use-toast';
import { BadgeCheckIcon, ChevronsUpDown } from 'lucide-react';
import { SocialIcon } from 'react-social-icons';

const SearchUsersPage = ({ userId, users }: { userId: string, users: any }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedEducationLevel, setSelectedEducationLevel] = useState('');
    const [selectedVerified, setSelectedVerified] = useState(''); // State for verified filter
    const [skills, setSkills] = useState<string[]>([]);
    const [institutions, setInstitutions] = useState<string[]>([]);
    const [educationLevels, setEducationLevels] = useState<string[]>([]);
    const [openSkill, setOpenSkill] = useState(false);
    const [openInstitution, setOpenInstitution] = useState(false);
    const [openEducationLevel, setOpenEducationLevel] = useState(false);
    const [openVerified, setOpenVerified] = useState(false); // State for verified filter popover

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!userId) {
            redirect("/");
        }
    }, [userId]);

    useEffect(() => {
        const fetchFilters = () => {
            const allSkills: Set<string> = new Set();
            const allInstitutions: Set<string> = new Set();
            const allEducationLevels: Set<string> = new Set();

            users.forEach((user: { skills: string; InstitutionName: string; EducationLevel: string; }) => {
                // Extract skills
                if (user.skills) {
                    user.skills.split(',').map(skill => skill.trim()).forEach(skill => allSkills.add(skill));
                }
                // Extract institutions
                if (user.InstitutionName) {
                    allInstitutions.add(user.InstitutionName);
                }
                // Extract education levels
                if (user.EducationLevel) {
                    allEducationLevels.add(user.EducationLevel);
                }
            });

            setSkills(Array.from(allSkills));
            setInstitutions(Array.from(allInstitutions));
            setEducationLevels(Array.from(allEducationLevels));
        };

        fetchFilters();
    }, [users]);

    const filteredUsers = users.filter((user: { name: string; skills: string; InstitutionName: string; EducationLevel: string; verified: boolean }) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedSkill === '' || (user.skills && user.skills.toLowerCase().includes(selectedSkill.toLowerCase()))) &&
        (selectedInstitution === '' || (user.InstitutionName && user.InstitutionName.toLowerCase().includes(selectedInstitution.toLowerCase()))) &&
        (selectedEducationLevel === '' || user.EducationLevel === selectedEducationLevel) &&
        (selectedVerified === '' || (selectedVerified === 'verified' && user.verified) || (selectedVerified === 'unverified' && !user.verified))
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMMM yyyy');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSkillChangeCombobox = (value: string) => {
        setSelectedSkill(value);
        setCurrentPage(1);
        setOpenSkill(false);
    };

    const handleInstitutionChangeCombobox = (value: string) => {
        setSelectedInstitution(value);
        setCurrentPage(1);
        setOpenInstitution(false);
    };

    const handleEducationLevelChangeCombobox = (value: string) => {
        setSelectedEducationLevel(value);
        setCurrentPage(1);
        setOpenEducationLevel(false);
    };

    const handleVerifiedChangeCombobox = (value: string) => {
        setSelectedVerified(value);
        setCurrentPage(1);
        setOpenVerified(false);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const clearFilters = () => {
        setSelectedEducationLevel('');
        setSelectedInstitution('');
        setSelectedSkill('');
        setSelectedVerified(''); // Clear verified filter
        setCurrentPage(1);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast({
                    title: "Email Copied to Clipboard",
                });
            })
            .catch((err) => {
                toast({
                    title: "Error",
                    description: "Error Copying Email",
                });
            });
    };

    return (
        <div>
            <div className='py-4 space-y-4 space-x-4'>
                {/* Search Bar */}
                <Input
                    type="text"
                    placeholder="🔎 Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {/* Skill Combobox */}
                <Popover open={openSkill} onOpenChange={setOpenSkill}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSkill}
                            className="justify-between"
                        >
                            {selectedSkill || "All Skills"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Command>
                            <CommandInput
                                placeholder="Skill..."
                                onInput={(e) => setSelectedSkill(e.currentTarget.value)}
                            />
                            <CommandEmpty>No Skills Found</CommandEmpty>
                            <CommandList>
                                {skills.map(skill => (
                                    <CommandItem
                                        key={skill}
                                        onSelect={() => handleSkillChangeCombobox(skill)}
                                    >
                                        {skill}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {/* Institution Combobox */}
                <Popover open={openInstitution} onOpenChange={setOpenInstitution}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openInstitution}
                            className="justify-between"
                        >
                            {selectedInstitution || "All Institutions"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Command>
                            <CommandInput
                                placeholder="Institution..."
                                onInput={(e) => setSelectedInstitution(e.currentTarget.value)}
                            />
                            <CommandEmpty>No Institutions Found</CommandEmpty>
                            <CommandList>
                                {institutions.map(institution => (
                                    <CommandItem
                                        key={institution}
                                        onSelect={() => handleInstitutionChangeCombobox(institution)}
                                    >
                                        {institution}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {/* Education Level Combobox */}
                <Popover open={openEducationLevel} onOpenChange={setOpenEducationLevel}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openEducationLevel}
                            className="justify-between"
                        >
                            {selectedEducationLevel || "All Education Levels"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Command>
                            <CommandInput
                                placeholder="Education Level..."
                                onInput={(e) => setSelectedEducationLevel(e.currentTarget.value)}
                            />
                            <CommandEmpty>No Education Levels Found</CommandEmpty>
                            <CommandList>
                                {educationLevels.map(level => (
                                    <CommandItem
                                        key={level}
                                        onSelect={() => handleEducationLevelChangeCombobox(level)}
                                    >
                                        {level}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {/* Verified Combobox */}
                <Popover open={openVerified} onOpenChange={setOpenVerified}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openVerified}
                            className="justify-between"
                        >
                            {selectedVerified || "All Users"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Command>
                            <CommandInput
                                placeholder="Verified Status..."
                                onInput={(e) => setSelectedVerified(e.currentTarget.value)}
                            />
                            <CommandEmpty>No Verified Status Found</CommandEmpty>
                            <CommandList>
                                <CommandItem
                                    onSelect={() => handleVerifiedChangeCombobox('')}
                                >
                                    All Users
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleVerifiedChangeCombobox('verified')}
                                >
                                    Verified Users
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleVerifiedChangeCombobox('unverified')}
                                >
                                    Unverified Users
                                </CommandItem>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
                {/* User Cards */}
                {currentUsers.map((user: { id: string; name: string; InstitutionName: string; skills: string; EducationLevel: string; GraduationDate: string | number | Date; email: string; verified: boolean; linkedInLink: string; instagramLink: string; xLink: string; }) => (
                    <Card key={user.id} className='mb-4'>
                        <CardHeader>
                            <CardTitle className='font-bold flex'>
                                {user.name}
                                <span className='ml-2'>{user.verified && <BadgeCheckIcon />}</span>
                            </CardTitle>
                            <CardDescription>{user.InstitutionName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='sm:flex-col space-x-1'>
                                {user.skills ? user.skills.split(',').map((skill, index) => (
                                    <Badge key={index}>{skill.trim()}</Badge>
                                )) : (
                                    <p className='text-sm text-muted'>No Skills Added</p>
                                )}
                            </div>
                            <div className='flex flex-col py-2 justify-center'>
                                <div className='flex'>
                                    Education Level: {
                                        <div className='ml-1 font-semibold'>
                                            {user.EducationLevel}
                                        </div>
                                    }
                                </div>
                                <div className='flex'>
                                    Graduation Date: {
                                        <div className='ml-1 font-semibold'>
                                            {formatDate(user.GraduationDate)}
                                        </div>
                                    }
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button>Contact Me</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 px-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Socials</h4>
                                            <div className='flex space-x-4 py-2'>
                                                {user?.linkedInLink && (
                                                    <SocialIcon url={user?.linkedInLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                                )}
                                                {user?.instagramLink && (
                                                    <SocialIcon url={user?.instagramLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                                )}
                                                {user?.xLink && (
                                                    <SocialIcon url={user?.xLink} rel="noopener noreferrer" target="_blank" style={{ height: 40, width: 40 }} />
                                                )}
                                                {user.email && (
                                                    <SocialIcon
                                                        network="email"
                                                        style={{ height: 40, width: 40 }}
                                                        onClick={() => copyToClipboard(user.email)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button className="ml-auto" onClick={() => {
                                router.replace(`/users/${user.id}`)
                            }}>
                                Explore
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {/* Pagination Controls */}
                <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
                    <span className='py-2'>Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}</span>
                    <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>Next</Button>
                </div>
            </div>
        </div>
    );
};

export default SearchUsersPage;