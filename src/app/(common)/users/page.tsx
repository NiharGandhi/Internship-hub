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
      <SearchUsersPage />
    </div>
  );
}

export default UsersPage;
