"use client";

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image';

import FallBackImage from '../../../public/images/fallback.png';
import { Spinner } from '../spinner';
import axios from 'axios';

const ProjectCard = ({
    project,
    id,
}: { project: any, id: any
    
 }) => {

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetchUser(id);
        setLoading(false);
    }, [id]);

    const fetchUser = async (id: string) => {
        if (id) {
            try {
                const userData = await axios.get("/api/getUser", {
                    params: {
                        id: id,
                    }
                });
                setUser(userData.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
    };

    while (loading) {
        return <Spinner />;
    }

    return (
        <Link href={`/users/${user?.id}/projects/${project.id}`}>
            <Card className='hover:scale-105 transition-all hover:shadow hover:shadow-orange'>
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt='Project Image'
                        placeholder="empty"
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
                    <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}

export default ProjectCard