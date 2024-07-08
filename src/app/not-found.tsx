import Image from 'next/image'
import Link from 'next/link';

import NotFoundPlaceholder from "../../public/images/not-found.svg";
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className='flex flex-col h-screen justify-center items-center'>
            <div className='flex flex-col items-center justify-center'>
                <Image 
                    src={NotFoundPlaceholder}
                    alt='Not Found'
                    width={'100'}
                    height={'100'}
                />
                <h2 className='font-bold text-4xl'>Page Not Found</h2>
                <Button>
                    <Link href="/home">Return Home</Link>
                </Button>
            </div>
        </div>
    )
}