"use client";

import React from 'react';

import Link from "next/link";
import { useSelectedLayoutSegment } from 'next/navigation';

import useScroll from "@/hooks/sidenav/use-scroll";
import { cn } from '@/lib/utils';
import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '../ui/button';

const Header = () => {

    const { user } = useUser();
    
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
        className={cn(
            `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-orange`,
            {
                "border-b border-orange bg-white/75 backdrop-blur-lg": scrolled,
                "border-b border-orange bg-white": selectedLayout,
            }
        )}
    >
        <div className='flex h-[47px] items-center justify-between px-4'>
            <div className='flex items-center space-x-4'>
                {user ? ( 
                    <Link
                        href="/home"
                        className='flex flex-row space-x-3 items-center justify-center md:hidden'
                    >
                        <span className='h-7 w-7 bg-zinc-300 rounded-lg' />
                        <span className='font-bold text-xl flex' >InternVista</span>
                    </Link>
                ) : (
                    <Link
                        href="/home"
                        className='flex flex-row space-x-3 items-center justify-center md:hidden'
                    >
                        <span className='h-7 w-7 bg-zinc-300 rounded-lg' />
                        <span className='font-bold text-xl flex' >InternVista</span>
                    </Link>
                 )}
            </div>

            <div className='hidden md:block'>
                {user ? (
                    <div className='h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center'>
                        <UserButton />
                    </div>
                ): (
                    <div>
                        <Button className='bg-orange text-black hover:bg-gray-300'>
                            <Link href={'/auth/sign-in'}>Sign In</Link>
                        </Button>  
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Header