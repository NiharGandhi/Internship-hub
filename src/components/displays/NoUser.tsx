import React from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const NoUserCard = () => {
    const router = useRouter();

    return (
        <div className='flex min-h-svh items-center justify-center'>
            <Card className='flex flex-col'>
                <CardHeader className='justify-center items-center'>
                    <CardTitle className='text-lg text-center'>
                        Oops! Sign In to get Internships
                    </CardTitle>
                </CardHeader>
                <CardFooter className='justify-center items-center'>
                    <Button onClick={() => router.push("/auth/sign-in")}>
                        Sign In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default NoUserCard