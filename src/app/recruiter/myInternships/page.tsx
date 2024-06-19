"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import axios from 'axios';
import { CalendarIcon, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import NoDataPlaceholder from "../../../../public/images/myPagePlaceholder.svg";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Spinner } from '@/components/spinner';

const MyInternshipsPage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [internshipData, setInternshipData] = useState<any>(null);


    useEffect(() => {
        const fetchCompanyInternships = async () => {
            try {
                const response = await axios.get("/api/addInternships");
                setInternshipData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchCompanyInternships();
    }, []);

    if (loading) return <Spinner />;

  return (
    <div className='p-4'>
          <Breadcrumb className='mb-4'>
              <BreadcrumbList>
                  <BreadcrumbItem>
                      <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <BreadcrumbPage>My Internships</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>
          <Card>
              <CardHeader>
                  <CardTitle>Your Internships</CardTitle>
              </CardHeader>
              <CardContent>
                  {internshipData ? (internshipData !== null && (
                      <div className='grid grid-cols-1 gap-4 mt-4'>
                          {internshipData.map((project: any, index: number) => (
                              <div key={index} className="flex items-center gap-4">
                                  {project.link ? ( // Check if project has a link
                                      <> {/* Wrap in Link if project has a link */}
                                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                              <Link href={project.link}>
                                                  <LinkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                              </Link>
                                          </div>
                                          <div className='w-32 lg:w-96'>
                                              <h3 className="text-lg font-semibold">{project.name}</h3>
                                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                                          </div>
                                      </>
                                  ) : ( // Render just the div if project does not have a link
                                      <>
                                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                              <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                          </div>
                                          <div className='w-32 lg:w-96'>
                                              <h3 className="text-lg font-semibold">{project.name}</h3>
                                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                                          </div>
                                      </>
                                  )}
                                  <div className='ml-auto space-x-1'>
                                    <Link href={`/recruiter/myInternships/${project.id}`}>
                                        <Button>
                                            Check Applications
                                        </Button>
                                    </Link>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )) : (
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-2xl text-muted-foreground'>No Internships Posted. POST NOW!!!</h1>
                        <Image 
                            src={NoDataPlaceholder}
                            alt='No Internships Posted'
                            width={400}
                            height={400}
                            className='animate-pulse align-middle'
                        />
                    </div>
                  )}
              </CardContent>
          </Card>
    </div>
  )
}

export default MyInternshipsPage