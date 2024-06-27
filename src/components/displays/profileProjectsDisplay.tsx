import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { CalendarIcon, LinkIcon } from 'lucide-react'

const ProfileProjectsDisplay = ({
    projects
}: {projects: any}) => {
  return (
    <>
          <div className='flex'>
              <h2 className='font-bold text-2xl font-sans py-4'>Projects</h2>
              <Link href={"/intern/myProfile/projects"} className='py-4 ml-auto'>
                  <Button>
                      Edit Projects
                  </Button>
              </Link>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                  {projects !== null && (
                      <div className='grid grid-cols-1 gap-4 mt-4'>
                          {projects.map((project: any, index: number) => (
                              <div key={index} className="flex items-center gap-4">
                                  {project.link ? ( // Check if project has a link
                                      <> {/* Wrap in Link if project has a link */}
                                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                              <Link href={project.link}>
                                                  <LinkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                              </Link>
                                          </div>
                                          <div className='w-32 lg:w-[800px]'>
                                              <h3 className="text-lg font-semibold line-clamp-2">{project.name}</h3>
                                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
                                          </div>
                                      </>
                                  ) : ( // Render just the div if project does not have a link
                                      <>
                                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                              <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                          </div>
                                          <div className='w-32 lg:w-[800px]'>
                                              <h3 className="text-lg font-semibold line-clamp-2">{project.name}</h3>
                                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{project.description}</p>
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

export default ProfileProjectsDisplay