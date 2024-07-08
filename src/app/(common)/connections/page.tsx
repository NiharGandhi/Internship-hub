// UsersPage.tsx
import { auth } from '@clerk/nextjs/server';

import React from 'react';

import { redirect } from 'next/navigation';

import Header from '@/components/header/header';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import { client } from '@/lib/prisma';
import SearchUsersPage from '../users/_components/SearchUsersPage';

const Connections = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/") // Handle redirecting or displaying a message
    }

    const users = await client.connectRequest.findMany({
        where: {
            receiverUserId: userId
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
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='font-bold text-4xl mt-2 lg:px-10'>Users</h1>
            <SearchUsersPage userId={userId} users={users} />
        </div>
    );
}

export default Connections;
