'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SideNavItem } from '@/types';
import { Icon } from '@iconify/react';
import { INTERNSHIP_FINDER_SIDENAV_ITEMS, RECRUITER_SIDENAV_ITEMS } from '@/constants/navigation';
import { useUser } from '@clerk/nextjs';
import { Spinner } from '../spinner';

const SideNav = () => {
    const [navItems, setNavItems] = useState<SideNavItem[]>([]);

    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (user) {
            const userType = user.publicMetadata?.userType;

            if (userType === 'INTERNSHIP_FINDER') {
                setNavItems(INTERNSHIP_FINDER_SIDENAV_ITEMS);
            } else if (userType === 'RECRUITER') {
                setNavItems(RECRUITER_SIDENAV_ITEMS);
            }
        }
    }, [user]);

    if (!isLoaded) {
        return <Spinner />;
    }
    return (
        <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-orange hidden md:flex">
            <div className="flex flex-col space-y-6 w-full">
                {user ? (
                    <Link
                        href="/home"
                        className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
                    >
                        {/* LOGO */}
                        <span className="font-bold text-xl hidden md:flex">Internship Hub</span>
                    </Link>
                ) : (
                        <Link
                            href="/"
                            className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
                        >   
                            {/* LOGO */}
                            <span className="font-bold text-xl hidden md:flex">Internship Hub</span>
                        </Link>
                )}

                <div className="flex flex-col space-y-2  md:px-6 ">
                    {navItems.map((item, idx) => {
                        return <MenuItem key={idx} item={item} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="">
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${pathname.includes(item.path) ? 'bg-zinc-100' : ''
                            }`}
                    >
                        <div className="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className="font-semibold text-xl  flex">{item.title}</span>
                        </div>

                        <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                            <Icon icon="lucide:chevron-down" width="24" height="24" />
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        className={`${subItem.path === pathname ? 'font-bold' : ''
                                            }`}
                                    >
                                        <span>{subItem.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                        className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${pathname.includes(item.path) ? 'bg-zinc-100' : ''
                        }`}
                >
                    {item.icon}
                    <span className="font-semibold text-xl flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};