// UsersPage.tsx
import { auth } from '@clerk/nextjs/server';

import React from 'react';

import { redirect } from 'next/navigation';

import Header from '@/components/header/header';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import { client } from '@/lib/prisma';
import SearchUsersPage from './_components/SearchUsersPage';

const UsersPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/") // Handle redirecting or displaying a message
  }

  const users = await client.user.findMany();

  return (
    <div>
      <Breadcrumb className='mt-3 ml-10'>
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
      <h1 className='font-bold text-4xl mt-2 px-10'>Users</h1>
      <SearchUsersPage userId={userId} users={users} />
    </div>
  );
}

export default UsersPage;
