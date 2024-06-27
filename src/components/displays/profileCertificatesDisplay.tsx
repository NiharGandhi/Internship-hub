import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CalendarIcon, LinkIcon } from 'lucide-react'

const ProfileCertificatesDisplay = ({
    certificates
}: {certificates: any}) => {
  return (
    <>
          <div className='flex'>
              <h2 className='font-bold text-2xl font-sans py-4'>Certificates</h2>
              <Link href={"/intern/myProfile/certificates"} className='py-4 ml-auto'>
                  <Button>
                      Edit Certificates
                  </Button>
              </Link>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle>Your Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                  {certificates !== null && (
                      <div className='grid grid-cols-1 gap-4 mt-4'>
                          {certificates.map((certicate: any, index: number) => (
                              <div key={index} className="flex items-center gap-4">
                                  {certicate.link ? ( // Check if project has a link
                                      <> {/* Wrap in Link if project has a link */}
                                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                              <Link href={certicate.link}>
                                                  <LinkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                              </Link>
                                          </div>
                                          <div className='w-32 lg:w-[800px]'>
                                              <h3 className="text-lg font-semibold line-clamp-2">{certicate.name}</h3>
                                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{certicate.description}</p>
                                          </div>
                                      </>
                                  ) : ( // Render just the div if project does not have a link
                                      <>
                                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                              <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                          </div>
                                          <div className='w-32 lg:w-[800px]'>
                                              <h3 className="text-lg font-semibold line-clamp-2">{certicate.name}</h3>
                                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{certicate.description}</p>
                                          </div>
                                      </>
                                  )}
                              </div>
                          ))}
                      </div>
                  )}
              </CardContent>
          </Card>
    </>
  )
}

export default ProfileCertificatesDisplay