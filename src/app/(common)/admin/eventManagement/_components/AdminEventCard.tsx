// components/EventCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, EllipsisVertical } from 'lucide-react';
import { format, isBefore } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface Event {
    id: string;
    title: string;
    dateTime: string;
}

interface EventCardProps {
    events: Event[];
    title: string;
    desc: string;
    upcomingEventsActive: boolean;
    pastEventsActive: boolean;
}

const AdminEventCard: React.FC<EventCardProps> = ({ events, title, desc, upcomingEventsActive, pastEventsActive  }) => {

    const { toast } = useToast();

    const router = useRouter();

    const handleDelete = async (index: any) => {
        try {
            const response = await axios.delete(`/api/events/${index}`);

            toast({
                title: "Congratulations",
                description: "Profile Deleted Successfully.",
            })

            window.location.reload();
        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the project.",
            });
        }
    };

    const handleEdit = async (index: any) => {
        try {
            router.push(`/admin/eventManagement/${index}`)
        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the project.",
            });
        }
    };

    const currentDate = new Date();
    const pastEvents = events.filter(event => isBefore(new Date(event.dateTime), currentDate));
    const upcomingEvents = events.filter(event => !isBefore(new Date(event.dateTime), currentDate));

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return format((dateString), 'dd MMMM yyyy');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <ScrollArea className='h-[300]'>
                <CardContent>
                    {upcomingEventsActive && (
                        <>
                            {upcomingEvents.length > 0 ? (
                                <div className="grid gap-4">
                                    {upcomingEvents.map((event) => (
                                        <div className="flex items-center gap-4" key={event.id}>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <div className='w-52 lg:w-[800px]'>
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.dateTime)}</p>
                                            </div>
                                            <div className='ml-auto space-x-1'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEdit(event.id)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(event.id)} className='text-red-500'>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No Events available.</p>
                            )}
                        </>
                    )}
                    {pastEventsActive && (
                        <>
                            {pastEvents.length > 0 ? (
                                <div className="grid gap-4">
                                    {pastEvents.map((event) => (
                                        <div key={event.id} className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <div className='w-52 lg:w-[800px]'>
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.dateTime)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No Events available.</p>
                            )}
                        </>
                    )}

                </CardContent>
            </ScrollArea>
        </Card>
    );
};

export default AdminEventCard;
