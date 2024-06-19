// components/EventCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookAIcon } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';

interface OnlineBook {
    id: string;
    name: string;
    author: string;
    link?: string;  // Make link optional
}

interface OnlineBookProps {
    resources: OnlineBook[];
    title: string;
    cardDesc: string;
}

const OnlineBookCard: React.FC<OnlineBookProps> = ({ resources, title, cardDesc }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{cardDesc}</CardDescription>
            </CardHeader>
            <ScrollArea className='h-[300]'>
                <CardContent>
                    {resources.length > 0 ? (
                        <div className="grid gap-4">
                            {resources.map((resource) => (
                                <div key={resource.id} className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <BookAIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    {resource.link ? (
                                        <Link href={resource.link} rel="noopener noreferrer" target="_blank">
                                            <div>
                                                <h3 className="text-lg font-semibold">{resource.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">by {resource.author}</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div>
                                            <h3 className="text-lg font-semibold">{resource.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">by {resource.author}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No Books available.</p>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
};

export default OnlineBookCard;
