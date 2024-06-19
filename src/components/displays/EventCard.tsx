// components/EventCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { format, isBefore } from 'date-fns';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';

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

const EventCard: React.FC<EventCardProps> = ({ events, title, desc, upcomingEventsActive, pastEventsActive  }) => {

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
                                        <Link key={event.id} href={`/events/${event.id}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                    <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <div className='w-52 lg:w-[500px]'>
                                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.dateTime)}</p>
                                                </div>
                                            </div>
                                        </Link>
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
                                        <Link key={event.id} href={`/events/${event.id}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                    <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <div className='w-52 lg:w-[500px]'>
                                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(event.dateTime)}</p>
                                                </div>
                                            </div>
                                        </Link>
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

export default EventCard;
