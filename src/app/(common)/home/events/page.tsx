"use client";

import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { isBefore } from 'date-fns';
import useEvents from '@/hooks/events/useEvents';
import EventCard from '@/components/displays/EventCard';


const EventsPage = () => {
    const { events, loading, error } = useEvents();

    const currentDate = new Date();
    const pastEvents = events.filter(event => isBefore(new Date(event.dateTime), currentDate));
    const upcomingEvents = events.filter(event => !isBefore(new Date(event.dateTime), currentDate));

    return (
        <div>
            <Breadcrumb className='mt-3 ml-2 lg:ml-10'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Events</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='font-bold text-4xl mt-2 px-1 lg:px-10'>Events</h1>
            <div className="flex flex-col">
                <main className="lg:py-6 py-4">
                    <div className="grid">
                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                            <div className="container mx-auto px-4">
                                <div>
                                    {upcomingEvents.length > 0 ? (
                                        <EventCard events={upcomingEvents} title='Upcoming Events' desc='Events you may be interested in' upcomingEventsActive pastEventsActive={false}/>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events available.</p>
                                    )}
                                </div>
                            </div>
                            <div className="container mx-auto px-4">
                                <div>
                                    {pastEvents.length > 0 ? (
                                        <EventCard events={pastEvents} title='Past Events' desc='Events you may have been interested in' upcomingEventsActive={false} pastEventsActive/>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No past events available.</p>
                                    )}
                                </div>  
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default EventsPage