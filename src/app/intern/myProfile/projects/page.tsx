"use client"

import React, { useEffect, useState } from 'react';
import axios from "axios";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { CalendarIcon, EllipsisVertical, LinkIcon } from 'lucide-react';

import { Spinner } from '@/components/spinner';
import { FileUpload } from '@/components/file-upload/file-upload';

const formSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(1),
    link: z.string().optional(),
    imageUrl: z.string().optional(),
})

const AddProjectsPage = () => {

    const { toast } = useToast();

    const router  = useRouter();

    const [userData, setUserData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/addProjects");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
        setLoading(false);
    }, []);

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
        if (userData) {
            form.reset({
                name: userData.name,
                description: userData.description,
                link: userData.link,
                imageUrl: userData.imageUrl,
            });
        }
    }, [form, userData]);

    // Resume URL rendering logic
    const renderResumeUrl = () => {
        return <FileUpload endpoint="projectImage" onChange={handleResumeUpload} />;
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
        return (
            <>
                <Button className='ml-1' onClick={() => onSubmit(form.getValues())}>Save</Button>
            </>
        );
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
            const response = await axios.put("/api/addProjects", values);
            // router.push(`/users/${response.data.id}`);
            toast({
                title: "Congratulations",
                description: "Profile Updated Successfully.",
            })
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleDelete = async (index: any) => {
        try {
            const projectId = userData[index].id; // Assuming the project ID is stored in userData

            const response = await axios.delete(`/api/addProjects/${projectId}`);

            toast({
                title: "Congratulations",
                description: "Profile Deleted Successfully.",
            })

            window.location.reload();

        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the project.",
            });
        }
    };

    const handleEdit = async (index: any) => {
        try {
            const projectId = userData[index].id; // Assuming the project ID is stored in userData

            router.push(`/intern/myProfile/projects/${projectId}`)

        } catch (error) {
            console.error("Error Editing project:", error);
            toast({
                title: "Error",
                description: "An error occurred while Editing the project.",
            });
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
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/myProfile">My Profile</BreadcrumbLink>
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
                                            <FormLabel>Name of the Project</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Internship Hub" {...field} required/>
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
                                                <Input placeholder="www.google.com" {...field} />
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
                                                        {renderResumeUrl()}
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
                    <div className='w-full lg:w-1/2 py-9'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userData !== null && (
                                    <div className='grid grid-cols-1 gap-4 mt-4'>
                                        {userData.map((project: any, index: number) => (
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
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleEdit(index)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDelete(index)} className='text-red-500'>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProjectsPage