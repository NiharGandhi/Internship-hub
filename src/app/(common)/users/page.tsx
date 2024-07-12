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
import ErrorCard from '@/components/displays/ErrorCard';

const UsersPage = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Spinner />
  }

  if (!user) {
    redirect("/")
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
      <h1 className="font-bold text-4xl">Users</h1>
      <SearchUsersPage />
    </div>
  );
}

export default UsersPage;
