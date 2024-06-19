'use server'

import { client } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs'
import axios from 'axios'

export const onCompleteUserRegistration = async (
    name: string,
    userId: string,
    email: string,
    userType: string
) => {
    try {
        if (userType === 'INTERNSHIP_FINDER') {
            const registered = await client.user.create({
                data: {
                    name,
                    userId,
                    email,
                    userType,
                },
                select: {
                    name: true,
                    id: true,
                    userType: true,
                },
            })

            if (registered) {
                // Update Clerk metadata
                await clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        userType,
                    },
                });

                return { status: 200, user: registered };
            }

        } else if (userType === 'RECRUITER') {
            const registered = await client.company.create({
                data: {
                    name,
                    userId,
                    email,
                    userType,
                },
                select: {
                    name: true,
                    id: true,
                    userType: true,
                },
            })

            if (registered) {
                // Update Clerk metadata
                await clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        userType,
                    },
                });

                return { status: 200, user: registered };
            }
        }
    } catch (error) {
        return { status: 400 }
    }
}