import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CalendarIcon, LinkIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { auth } from '@clerk/nextjs'

import FallBackImage from '../../../public/images/fallback.png';
import { redirect } from 'next/navigation'
import { client } from '@/lib/prisma'

const CertificateCard = async ({
    certificate
}: { certificate: any }) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const user = await client.user.findUnique({
        where: {
            userId: userId,
        }
    })

    return (
        <Link href={`/users/${user?.id}/certificates/${certificate.id}`}>
            <Card className='hover:scale-105 transition-all hover:shadow hover:shadow-orange'>
                <CardHeader>
                    <CardTitle className='line-clamp-1'>{certificate.name}</CardTitle>
                    <CardDescription className="line-clamp-3 whitespace-pre-line">{certificate.description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}

export default CertificateCard