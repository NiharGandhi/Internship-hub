"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { format } from 'date-fns';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

interface Message {
    id: string;
    senderName: string;
    senderUserId: string;
    content: string;
    createdAt: string;
}

const MessagePage = ({ params }: { params: any }) => {
    const { applicationId } = params;
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageContent, setMessageContent] = useState('');
    const { user } = useUser(); // Fetch authenticated user using useUser hook

    useEffect(() => {
        // Fetch messages for the application
        const fetchMessages = async () => {
            const response = await axios.get(`/api/messages?applicationId=${applicationId}`);
            setMessages(response.data);
        };
        fetchMessages();
    });

    const handleSendMessage = async () => {
        if (messageContent.trim() === '') return;

        // Send message to the backend
        await axios.post('/api/messages', {
            applicationId,
            content: messageContent,
            senderId: user?.id, // Include senderId in the message payload
            senderName: user?.fullName, // Include senderName in the message payload
        });

        // Clear input and refresh messages
        setMessageContent('');
        const response = await axios.get(`/api/messages?applicationId=${applicationId}`);
        setMessages(response.data);
    };

    if (!user) {
        return <p>Loading...</p>; // Loading state while user data is being fetched
    }

    return (
        <div className='p-4'>
            <Breadcrumb className='mt-3 ml-10'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/recruiter/myInternships">My Internships</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Messages</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className='mt-4'>
                <CardHeader>
                    <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`border-b pb-2 ${msg.senderUserId === user.id ? 'text-right' : 'text-left'}`}
                            >
                                <p>{msg.content}</p>
                                <p className='text-muted-foreground text-sm'>{format(new Date(msg.createdAt), 'dd MMM yyyy, HH:mm')}</p>
                            </div>
                        ))}
                    </div>
                    <div className='mt-4'>
                        <Input
                            type='text'
                            placeholder='Type a message'
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                        <Button className='mt-2' onClick={handleSendMessage}>Send</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MessagePage;
