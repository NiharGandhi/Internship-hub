import React from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const ErrorCard = ({ message }: { message: String | null }) => {
    const router = useRouter();

    return (
        <div className='flex min-h-svh items-center justify-center'>
            <Card className='flex flex-col'>
                <CardHeader className='justify-center items-center'>
                    <CardTitle className='text-lg text-center'>
                        Oops! That was not supposed to happen.
                    </CardTitle>
                    {message && (
                        <CardDescription className='text-center'>
                            <p className='text-lg font-sans'>
                                {message}
                            </p>
                        </CardDescription>
                    )}
                </CardHeader>
                <CardFooter className='justify-center items-center'>
                    <Button onClick={() => router.push("/home")}>
                        Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ErrorCard