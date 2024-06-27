"use client";

import React from 'react';

import { Button } from "@/components/ui/button";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import Link from 'next/link';

const ResourceManagement = () => {

  return (
    <div className='py-4 px-6'>
      <Breadcrumb className='mb-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resources Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className='text-4xl font-bold font-sans'>
        Resources Management
      </h1>
      <div className='py-2 flex flex-col space-y-4'>
        <Link href={'/admin/resourceManagement/onlineResources'}>
          <Button>Online Resources</Button>
        </Link>
        <Link href={'/admin/resourceManagement/recommendedBooks'}>
          <Button>Recommended Books</Button>
        </Link>
        <Link href={'/admin/resourceManagement/usefulTools'}>
          <Button>Useful Tools</Button>
        </Link>
      </div>
    </div>
  );
};

export default ResourceManagement;
