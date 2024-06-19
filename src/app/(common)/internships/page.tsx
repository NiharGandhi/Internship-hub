import { client } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import SearchInternshipsPage from './_components/SearchInternships';



const InternshipsPage = async () => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const internships = await client.createInternship.findMany({
        include: {
            user: true,
        }
    });

    return (
        <div>
            {internships ? (
                <SearchInternshipsPage internships={internships} />
            ) : (
                <div className='items-center justify-center'>
                    <p>No Internships Available Right Now</p>
                </div>
            )}
        </div>
    );
}

export default InternshipsPage;