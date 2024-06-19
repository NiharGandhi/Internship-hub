import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CalendarIcon, LinkIcon } from 'lucide-react'

const CompanyInterhsipsDisplay = ({
    internships
}: {internships: any}) => {
  return (
    <>  
        {internships ? (
            <>
                <div className='flex'>
                    <h2 className='font-bold text-2xl font-sans py-4'>Internships</h2>
                      <Link href={"/recruiter/myOrganization/createInternship"} className='py-4 ml-auto'>
                        <Button>
                            Edit Internships
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Internships</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {internships !== null && (
                            <div className='grid grid-cols-1 gap-4 mt-4'>
                                {internships.map((internship: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                            <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div className='w-32 lg:w-[800px]'>
                                            <h3 className="text-lg font-semibold">{internship.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{internship.InternshipDescription}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </>
        ) : (
            <>
                <div className='flex'>
                    <h2 className='font-bold text-2xl font-sans py-4'>Internships</h2>
                          <Link href={"/myOrganization/createInternship"} className='py-4 ml-auto'>
                        <Button>
                            Add Internships
                        </Button>
                    </Link>
                </div>
                <div className='items-center justify-center'>
                    No Internships Posted Yet
                </div>
            </>
        )}
    </>
  )
}

export default CompanyInterhsipsDisplay