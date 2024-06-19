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
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';

import { CalendarIcon, EllipsisVertical, LinkIcon } from 'lucide-react';


import { Textarea } from "@/components/ui/textarea";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { FileUpload } from '@/components/file-upload/file-upload';
import { Spinner } from '@/components/spinner';


const formSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(1),
    link: z.string().optional(),
    certificateUrl: z.string().optional(),
})


const AddCertificatesPage = () => {

    const { toast } = useToast();

    const router  = useRouter();

    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // State to track loading

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/addCertificates");
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
            certificateUrl: "",
        },
    });

    useEffect(() => {
        if (userData) {
            form.reset({
                name: userData.name,
                description: userData.description,
                link: userData.link,
                certificateUrl: userData.certificateUrl,
            });
        }
    }, [form, userData]);

    // Resume URL rendering logic
    const renderCertificateAttachment = () => {
        return <FileUpload endpoint="userCertificate" onChange={handleAttachmentUpload} />;
    };


    // Handle resume upload
    const handleAttachmentUpload = (url?: string) => {
        if (url) {
            form.setValue("certificateUrl", url);
        }
    };

    // Button rendering logic
    const renderButtons = () => {
            return <Button className='ml-1' onClick={() => onSubmit(form.getValues())}>Save</Button>;
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/addCertificates", values);
            toast({
                title: "Congratulations",
                description: "certificate Created Successfully.",
            })

            window.location.reload();
            
        } catch {
            toast({
                title: "Error",
                description: "Error while Creating certificate .",
            })
            console.log("[ERROR] Something went wrong while creating certificate");
        }
    }

    const onSave = async () => {
        try {
            const values = form.getValues(); // Retrieve form values
            const response = await axios.put("/api/addCertificates", values);
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
            const certificateId = userData[index].id; // Assuming the certificate ID is stored in userData

            const response = await axios.delete(`/api/addCertificates/${certificateId}`);

            toast({
                title: "Congratulations",
                description: "Profile Deleted Successfully.",
            })

            window.location.reload();

        } catch (error) {
            console.error("Error deleting certificate:", error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the certificate.",
            });
        }
    };

    const handleEdit = async (index: any) => {
        try {
            const certificateId = userData[index].id; // Assuming the certificate ID is stored in userData

            router.push(`/intern/myProfile/certificates/${certificateId}`)

        } catch (error) {
            console.error("Error deleting certificate:", error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the certificate.",
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
                            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/intern/myProfile">My Profile</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Add Certificates</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className='text-4xl font-bold font-sans'>
                    Add Certificates
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
                                            <FormLabel>Name of the Certification</FormLabel>
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
                                            <FormLabel>Link for Certificate</FormLabel>
                                            <FormControl>
                                                <Input placeholder="www.google.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <p className='text-gray-500 items-center justify-center'>or</p>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="certificateUrl"
                                        render={({ field }) => (
                                            <FormControl>
                                                <FormItem>
                                                    <FormLabel>Certificate Attachment</FormLabel>
                                                    <FormControl>
                                                        {renderCertificateAttachment()}
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
                                <CardTitle>Your Certificates</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userData !== null && (
                                    <div className='grid grid-cols-1 gap-4 mt-4'>
                                        {userData.map((certificate: any, index: number) => (
                                            <div key={index} className="flex items-center gap-4">
                                                {certificate.link ? (
                                                    <>
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                            <Link href={certificate.link}>
                                                                <LinkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                            </Link>
                                                        </div>
                                                        <div className='w-32 lg:w-96'>
                                                            <h3 className="text-lg font-semibold">{certificate.name}</h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{certificate.description}</p>
                                                        </div>
                                                    </>
                                                ) : ( // Render just the div if certificate does not have a link
                                                    <>
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                                            <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                        </div>
                                                        <div className='w-32 lg:w-96'>
                                                            <h3 className="text-lg font-semibold">{certificate.name}</h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{certificate.description}</p>
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

export default AddCertificatesPage