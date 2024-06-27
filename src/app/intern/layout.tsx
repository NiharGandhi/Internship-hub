'use client';

import { Spinner } from '@/components/spinner';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const Layout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (user) {
            const userType = user.publicMetadata?.userType;

            // Redirect or manage access based on userType
            if (userType !== 'INTERNSHIP_FINDER') {
                redirect("/home");
            }
        }
    }, [user]);

    // if (!isLoaded) {
    //     return <Spinner />;
    // }

    return (
        <div>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
