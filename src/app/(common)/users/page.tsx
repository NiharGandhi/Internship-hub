"use client";

import React from 'react';

import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

import SearchUsersPage from './_components/SearchUsersPage';
import useUsers from '@/hooks/users/useUsers';
import { Spinner } from '@/components/spinner';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const UsersPage = () => {
  const { user, isLoaded } = useUser();
  const { users, loading, error } = useUsers();

  if (!user) {
    redirect("/")
  }

  if (loading && !isLoaded) {
    return <Spinner />
  }

  if (error) {
    <h1>Error Fetching Data</h1>
  }

  return (
    <div>
      <Breadcrumb className="mt-3 lg:ml-4">
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
      <h1 className="font-bold text-4xl px-4">Users</h1>
      <SearchUsersPage userId={user?.id} users={users} />
    </div>
  );
}

export default UsersPage;
