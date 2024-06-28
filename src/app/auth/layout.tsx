import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
    const user = await currentUser();

    if(user) {
        redirect("/")
    }

    return (
        <div className='h-screen flex w-auto justify-center'>
            <div className='w-full lg:w-[600px] ld:w-full flex flex-col items-start p-6'>
                <Image 
                    src="/images/InternVista.svg"
                    alt="LOGO"
                    sizes='100vw'
                    style={{
                        width: '20%',
                        height: 'auto',
                    }}
                    width={0}
                    height={0}
                />
                {children}
            </div>
            <div className='hidden xl:flex flex-1 w-full max-h-full max-w-4000px overflow-hidden relative bg-cream flex-col pt-10 pl-24 gap-3'>
                <h2 className='text-gravel md:text-4xl font-bold'>
                    Hello there 👋, Welcome to InternVista!
                </h2>
                <p className='text-iridium md:text-sm mb-10'>
                    InternVista is the ultimate platform for students to showcase their profiles and connect with top employers for Internship opportunities.
                </p>
                <Image 
                    src="/images/app-ui.png"
                    alt="App UI"
                    loading='lazy'
                    sizes='30'
                    className='absolute shrink-0 !w-[1600px] top-48'
                    width={0}
                    height={0}
                />
            </div>
        </div>
    )
}

export default Layout