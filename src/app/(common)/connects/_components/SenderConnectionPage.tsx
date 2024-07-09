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

const SenderConnectionPage = ({ userId, users }: { userId: string, users: any }) => {
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
                    <Card key={user.id} className='mb-4'>
                        <CardHeader>
                            <CardTitle className='font-bold flex justify-between items-center'>
                                <div>
                                    {user.receiverUser.name}
                                    <span className='ml-2'>{user?.verified && <BadgeCheckIcon />}</span>
                                </div>
                                <UpdateConnectionStatus connectionId={user.id} />
                            </CardTitle>
                            <CardDescription>{user.receiverUser.InstitutionName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='sm:flex-col space-x-1'>
                                {user.receiverUser.skills ? user.receiverUser.skills.split(',').map((skill: string, index: number) => (
                                    <Badge key={index}>{skill.trim()}</Badge>
                                )) : (
                                    <p className='text-sm text-muted'>No Skills Added</p>
                                )}
                            </div>
                            <div className='flex flex-col py-2 justify-center'>
                                <div className='flex'>
                                    Education Level: {
                                        <div className='ml-1 font-semibold'>
                                            {user.receiverUser.EducationLevel}
                                        </div>
                                    }
                                </div>
                                <div className='flex'>
                                    Graduation Date: {
                                        <div className='ml-1 font-semibold'>
                                            {formatDate(user.receiverUser.GraduationDate)}
                                        </div>
                                    }
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/users/${user.receiverUser.id}`} className='ml-auto'>
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

export default SenderConnectionPage;
