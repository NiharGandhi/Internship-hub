"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

const Admin = () => {
  return (
    <div className='flex flex-col space-y-4 py-4 px-2'>
      <Link href={"/admin/eventManagement"}>
        <Button>Add Event</Button>
      </Link>
      <Link href={"/admin/resourceManagement"}>
        <Button>Add Resources</Button>
      </Link>
    </div>
  )
}

export default Admin