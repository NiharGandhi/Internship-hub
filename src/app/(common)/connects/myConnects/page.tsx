// UsersPage.tsx
import { auth } from '@clerk/nextjs/server';

import React from 'react';

import { redirect } from 'next/navigation';

import Header from '@/components/header/header';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import { client } from '@/lib/prisma';
import ConnectionUsersPage from '../_components/ConnectionUsersPage';

const Connections = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/") // Handle redirecting or displaying a message
    }

    const user = await client.user.findUnique({
        where: {
            userId: userId
        }
    })

    const users = await client.connectRequest.findMany({
        where: {
            receiverUserId: user!.id,
            status: "ACCEPTED"
        },
        include: {
            senderUser: true
        }
    })

    return (
        <div>
            <Breadcrumb className='mt-3 lg:ml-10'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>My Connects</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='font-bold text-4xl mt-2 lg:px-10'>My Connects</h1>
            {users && users.length > 0 ? (
                <ConnectionUsersPage userId={userId} users={users} />
            ) : (
                <div className='flex justify-center items-center h-screen'>
                    <p className='text-muted-foreground'>No Connection Requests :(</p>
                </div>
            )}
        </div>
    );
}

export default Connections;
