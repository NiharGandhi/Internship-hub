'use client';

import { Icon } from '@iconify/react';

import { SideNavItem } from '@/types/index';
import { BriefcaseBusinessIcon, Building2Icon, LucideCheckCheck } from 'lucide-react';

export const INTERNSHIP_FINDER_SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Home',
        path: '/home',
        icon: <Icon icon="lucide:home" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'Home', path:'/home' },
            { title: 'Events', path: '/home/events' },
            { title: 'Resources', path: '/home/resources' }
        ]
    },
    {
        title: 'Users',
        path: '/users',
        icon: <Icon icon="lucide:network" width="24" height="24" />
    },
    {
        title: 'Projects',
        path: '/projects',
        icon: <Icon icon="lucide:folder-kanban" width="24" height="24" />
    },
    {
        title: 'Organizations',
        path: '/organizations',
        icon: <Building2Icon width = "24" height = "24" />
    },
    {
        title: 'Internships',
        path: '/internships',
        icon: <BriefcaseBusinessIcon width="24" height="24"/>,
        submenu: true,
        subMenuItems: [
            { title: 'Explore', path: '/internships' },
            { title: 'My Internships', path: '/intern/myInternships' }
        ]
    },
    {
        title: 'My Profile',
        path: '/intern/myProfile',
        icon: <Icon icon="lucide:user" width="24" height="24" />
    },
]

export const RECRUITER_SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Home',
        path: '/home',
        icon: <Icon icon="lucide:home" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'Home', path: '/home' },
            { title: 'Events', path: '/home/events' },
            { title: 'Resources', path: '/home/resources' }
        ]
    },
    {
        title: 'Users',
        path: '/users',
        icon: <Icon icon="lucide:user" width="24" height="24" />
    },
    {
        title: 'Projects',
        path: '/projects',
        icon: <Icon icon="lucide:folder-kanban" width="24" height="24" />
    },
    {
        title: 'Organizations',
        path: '/organizations',
        icon: <Building2Icon width="24" height="24" />
    },
    {
        title: 'Internships',
        path: '/internships',
        icon: <BriefcaseBusinessIcon width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'Explore', path: '/internships' },
            { title: 'Create Internship', path: '/recruiter/myOrganization/createInternship'},
            { title: 'My Internships', path: '/recruiter/myInternships' }
        ]
    },
    {
        title: 'My Organization',
        path: '/recruiter/myOrganization',
        icon: <Building2Icon width="24" height="24" />
    },
]