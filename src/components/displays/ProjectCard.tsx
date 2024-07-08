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

const ProjectCard = async ({
    project
}: { project: any }) => {

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
        <Link href={`/users/${user?.id}/projects/${project.id}`}>
            <Card className='hover:scale-105 transition-all hover:shadow hover:shadow-orange'>
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt='Project Image'
                        width={400}
                        height={40}
                        className='rounded-xl p-2 w-[292px] lg:w-[386px] h-[180px] lg:h-[200px]'
                    />
                ) : (
                        <Image
                            src={FallBackImage}
                            alt='Project Image'
                            width={400}
                            height={40}
                            className='rounded-xl p-2 w-[292px] lg:w-[386px] h-[180px] lg:h-[200px]'
                        />
                )}
                <CardHeader>
                    <CardTitle className='line-clamp-1'>{project.name}</CardTitle>
                    <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}

export default ProjectCard