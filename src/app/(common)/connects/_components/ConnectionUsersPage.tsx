"use client";

import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';

import Link from 'next/link';
import { redirect } from 'next/navigation';

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
import UpdateConnectionStatus from '@/components/buttons/UpdateConnectionButton';

const ConnectionUsersPage = ({ userId, users }: { userId: string, users: any }) => {
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

    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMMM yyyy');
    };

    if (!userId) {
        return redirect("/");
    }

    return (
        <div>
            <div className='py-4 space-y-4 space-x-4'>
                {users.map((user: any) => (
                    <Card key={user.senderUser.id} className='mb-4'>
                        <CardHeader>
                            <CardTitle className='font-bold flex justify-between items-center'>
                                <div>
                                    {user.senderUser.name}
                                    <span className='ml-2'>{user?.verified && <BadgeCheckIcon />}</span>
                                </div>
                                <UpdateConnectionStatus connectionId={user.id} />
                            </CardTitle>
                            <CardDescription>{user.senderUser.InstitutionName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='sm:flex-col space-x-1'>
                                {user.senderUser.skills ? user.senderUser.skills.split(',').map((skill: string, index: number) => (
                                    <Badge key={index}>{skill.trim()}</Badge>
                                )) : (
                                    <p className='text-sm text-muted'>No Skills Added</p>
                                )}
                            </div>
                            <div className='flex flex-col py-2 justify-center'>
                                <div className='flex'>
                                    Education Level: {
                                        <div className='ml-1 font-semibold'>
                                            {user.senderUser.EducationLevel}
                                        </div>
                                    }
                                </div>
                                <div className='flex'>
                                    Graduation Date: {
                                        <div className='ml-1 font-semibold'>
                                            {formatDate(user.senderUser.GraduationDate)}
                                        </div>
                                    }
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/users/${user.senderUser.id}`} className='ml-auto'>
                                    <Button>
                                        Explore
                                    </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ConnectionUsersPage;
