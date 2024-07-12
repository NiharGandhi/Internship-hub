// SearchUsersPage.tsx
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
import { BadgeCheckIcon, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import useUsers from '@/hooks/users/useUsers';
import { Spinner } from '@/components/spinner';
import ErrorCard from '@/components/displays/ErrorCard';

const SearchUsersPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [openSkill, setOpenSkill] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [openInstitution, setOpenInstitution] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [openEducationLevel, setOpenEducationLevel] = useState(false);
    const [selectedEducationLevel, setSelectedEducationLevel] = useState('');

    const { users, loading, error, total, skills, institutions, educationLevels } = useUsers(currentPage, usersPerPage, searchQuery, selectedSkill, selectedInstitution, selectedEducationLevel);

    useEffect(() => {
        fetchSkills(skills);
        fetchInstitutions(institutions);
        fetchEducationLevels(educationLevels)
    }, [skills, institutions, educationLevels]);

    const fetchSkills = (skills: any[]) => {
        const allSkills: Set<string> = new Set();
        skills.forEach(skill => {
            if (skill.skills) {
                skill.skills.split(',').forEach((s: string) => allSkills.add(s.trim()));
            }
        });
        setAvailableSkills(Array.from(allSkills));
    };

    const fetchInstitutions = (institutions: any[]) => {
        const allInstitutions: Set<string> = new Set();
        institutions.forEach(institution => {
            if (institution.InstitutionName) {
                allInstitutions.add(institution.InstitutionName.trim());
            }
        });
        setAvailableInstitutions(Array.from(allInstitutions));
    };

    const fetchEducationLevels = (educationLevels: any[]) => {
        const allEducationLevels: Set<string> = new Set();
        educationLevels.forEach(educationLevel => {
            if (educationLevel.EducationLevel) {
                allEducationLevels.add(educationLevel.EducationLevel.trim());
            }
        });
        setAvailableEducationLevels(Array.from(allEducationLevels));
    };

    const [availableSkills, setAvailableSkills] = useState<string[]>([]);
    const [availableInstitions, setAvailableInstitutions] = useState<string[]>([]);
    const [availableEducationLevels, setAvailableEducationLevels] = useState<string[]>([]);


    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMMM yyyy');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSkillChangeCombobox = (value: string) => {
        setSelectedSkill(value);
        setOpenSkill(false);
    };

    const handleInstitutionChangeCombobox = (value: string) => {
        setSelectedInstitution(value);
        setOpenInstitution(false);
    };

    const handleEducationLevelChangeCombobox = (value: string) => {
        setSelectedEducationLevel(value);
        setOpenEducationLevel(false);
    };
    
    const handleNextPage = () => {
        if (currentPage < Math.ceil(total / usersPerPage)) {
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
    };

    if (loading) return <Spinner />;
    if (error) return <ErrorCard message={error} />

    return (
        <div>
            {/* Search Bar */}
            <div className='py-2 px-2 flex flex-col lg:flex-row gap-2'>
                <Input
                    type="text"
                    placeholder="🔎 Search users..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {/* Skill Box */}
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
                                {availableSkills.map(skill => (
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
                                {availableInstitions.map((institution, index) => (
                                    <CommandItem
                                        key={index}
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
                                {availableEducationLevels.map(level => (
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
                {/* CLEAR BUTTON */}
                <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
            </div>
            <div>

            </div>
            <div>
                {users.length === 0 ? (
                    <div>No Users Found</div>
                ) : (
                    users.map((user) => (
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
                                    {user.GraduationDate && (
                                        <div className='flex'>
                                            Graduation Date: {
                                                <div className='ml-1 font-semibold'>
                                                    {formatDate(user.GraduationDate)}
                                                </div>
                                            }
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/users/${user.id}`} className='ml-auto'>
                                    <Button>Explore</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4 mt-4">
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
                <span>Page {currentPage} of {Math.ceil(total / usersPerPage)}</span>
                <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(total / usersPerPage)}>Next</Button>
            </div>
        </div>
    );
};

export default SearchUsersPage;
