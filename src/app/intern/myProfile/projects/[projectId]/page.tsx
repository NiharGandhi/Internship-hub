"use client";

import React, { useEffect, useState } from 'react';
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Link from 'next/link';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

import { FileIcon } from 'lucide-react';

import { FileUpload } from '@/components/file-upload/file-upload';

import { Spinner } from '@/components/spinner';


const formSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(1),
    link: z.string().optional(),
    imageUrl: z.string().optional(),
});


const ProjectEditPage = ({
    params
} : {
    params: { projectId: string }
}) => {

    const { toast } = useToast();

    const [projectData, setProjectData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // State to track loading

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const urlId = params.projectId
    // console.log("URL ID: " + urlId);

    useEffect(() => {
        const fetchUserData = async () => {
            console.log("Fetching user data")
            try {
                const response = await axios.get(`/api/editProjects/${urlId}`)
                console.log("RESPONSE", response.data);
                setProjectData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
        setLoading(false);
    }, [urlId]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",// or another default
            link: "",
            imageUrl: "",
        },
    });

    useEffect(() => {
        if (projectData) {
            form.reset({
                name: projectData.name,
                description: projectData.description,
                link: projectData.link,
                imageUrl: projectData.imageUrl,
            });
        }
    }, [form, projectData]);

    // Resume URL rendering logic
    const renderProjectImage = () => {
        if (!projectData || !projectData.imageUrl) {
            if (isEditing) {
                return <FileUpload endpoint="projectImage" onChange={handleResumeUpload} />;
            } else {
                return (
                    <div className='flex items-center justify-center h-16 bg-slate-100 rounded-md text-slate-400'>
                        <FileIcon className='h-5 w-5 text-slate-400 mr-2' />
                        No Image Uploaded. Upload Now!!!
                    </div>
                );
            }
        } else if (projectData) {
            if (isEditing) {
                return <FileUpload endpoint="projectImage" onChange={handleResumeUpload} />;
            } else {
                return (
                    <Link href={projectData.imageUrl}>
                        <div className="flex items-center justify-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md">
                            <Image
                                src={projectData.imageUrl}
                                alt="Hero"
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                                width={"550"}
                                height={"310"}
                            />
                        </div>
                    </Link>
                );
            }
        } else {
            return (
                <div className='flex items-center justify-center h-16 bg-slate-100 rounded-md text-slate-400'>
                    <FileIcon className='h-5 w-5 text-slate-400 mr-2' />
                    No Image Uploaded. Upload Now!!!
                </div>
            );
        }
    };

    // Handle resume upload
    const handleResumeUpload = (url?: string) => {
        if (url) {
            form.setValue("imageUrl", url);
            onSave();
        }
    };

    // Button rendering logic
    const renderButtons = () => {
        if (isEditing) {
            return (
                <>
                    <Button type="button" onClick={toggleEdit}>Cancel</Button>
                    <Button className='ml-1' onClick={onSave}>Save</Button>
                </>
            );
        } else {
            return <Button type="button" onClick={toggleEdit}>Edit</Button>;
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/addProjects", values);
            toast({
                title: "Congratulations",
                description: "Project Created Successfully.",
            })

            window.location.reload();

        } catch {
            toast({
                title: "Error",
                description: "Error while Creating Project .",
            })
            console.log("[ERROR] Something went wrong while creating Project");
        }
    }

    const onSave = async () => {
        try {
            const values = form.getValues(); // Retrieve form values
            const response = await axios.put(`/api/editProjects/${projectData.id}`, values);
            // router.push(`/users/${response.data.id}`);
            toast({
                title: "Congratulations",
                description: "Profile Updated Successfully.",
            })
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    
    // Render loader while data is being fetched
    if (loading) return <Spinner />;

  return (
      <>
          <div className='py-4 px-6'>
              <Breadcrumb className='mb-4'>
                  <BreadcrumbList>
                      <BreadcrumbItem>
                          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                          <BreadcrumbLink href="/intern/myProfile">My Profile</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                          <BreadcrumbPage>Add Projects</BreadcrumbPage>
                      </BreadcrumbItem>
                  </BreadcrumbList>
              </Breadcrumb>
              <h1 className='text-4xl font-bold font-sans'>
                  Add Projects
              </h1>
              <div className='flex flex-col lg:flex-row '>
                  <div className='lg:w-1/2 lg:pr-4 flex flex-col space-y-6'>
                      <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className='flex-col py-6 lg:flex-col space-y-6'>
                              <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Name</FormLabel>
                                          <FormControl>
                                              <Input placeholder="InternVista" {...field} disabled={!isEditing}/>
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>

                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Description</FormLabel>
                                          <FormControl>
                                              <Textarea
                                                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing...."
                                                  {...field}
                                                  disabled={!isEditing}
                                              />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>

                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="link"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Link</FormLabel>
                                          <FormControl>
                                              <Input placeholder="www.google.com" {...field} disabled={!isEditing} />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>

                                  )}
                              />
                              <div>
                                  <FormField
                                      control={form.control}
                                      name="imageUrl"
                                      render={({ field }) => (
                                          <FormControl>
                                              <FormItem>
                                                  <FormLabel>Project Image</FormLabel>
                                                  <FormControl>
                                                      {renderProjectImage()}
                                                  </FormControl>
                                                  <FormMessage />
                                              </FormItem>
                                          </FormControl>
                                      )}
                                  />
                              </div>
                          </form>
                      </Form>
                      {renderButtons()}
                  </div>
              </div>
          </div>
      </>
  )
}

export default ProjectEditPage