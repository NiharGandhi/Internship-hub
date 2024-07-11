import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'

import FallBackImage from '../../../public/images/fallback.png';

const AllProjectsCard = ({
    project
}: { project: any }) => {

    return (
        <Link href={`/users/${project.user?.id}/projects/${project.id}`}>
            <Card>
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt='Project Image'
                        width={400}
                        height={40}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                        className='rounded-xl p-2'
                    />
                ) : (
                        <Image
                            src={FallBackImage}
                            alt='Project Image'
                            width={400}
                            height={40}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                            className='rounded-xl p-2'
                        />
                )}
                <CardHeader>
                    <CardTitle className='line-clamp-1'>{project.name}</CardTitle>
                    <CardDescription>{project.user.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='line-clamp-3'>
                        {project.description}
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

export default AllProjectsCard