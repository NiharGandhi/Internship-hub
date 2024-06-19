import React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { client } from '@/lib/prisma';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const EventIdPage = async ({
    params
} : {
        params: { eventId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const eventUrlId = params.eventId;

    console.log(eventUrlId);

    const event = await client.events.findUnique({
        where: {
            id: params.eventId
        }
    })

  return (
    <div>
          <Breadcrumb className='mt-2 ml-10'>
              <BreadcrumbList>
                  <BreadcrumbItem>
                      <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <BreadcrumbLink href="/home/events">Events</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <BreadcrumbPage>{event?.title}</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>

          <div className='py-4 px-8'>
              <Card>
                  <CardHeader>
                      <CardTitle className='font-bold flex'>
                          {event?.title}
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className='flex flex-col mt-4 justify-center space-y-2 mb-4'>
                          <div className='flex'>
                              <h2 className='font-semibold mr-2'>Date:</h2>
                              {event?.dateTime ? event.dateTime.toDateString() : 'N/A'}
                          </div>
                          <Separator />
                          {event?.description !== 'null' && (
                              <>
                                  <div>
                                      <h2 className='font-semibold'>Description:</h2>
                                      <p className='whitespace-pre-wrap font-light'>
                                          {event?.description}
                                      </p>
                                  </div>
                                  <Separator />
                              </>
                          )}
                          {event?.link  && event.link !== "" && (
                            <>
                                <div>
                                      <Link href={event.link} className='whitespace-pre-wrap font-light' rel="noopener noreferrer" target="_blank">
                                          <Button>Register</Button>
                                      </Link>
                                </div>
                            </>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>
    </div>
  )
}

export default EventIdPage