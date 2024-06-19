"use client"

import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from 'next/link';

import { format } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";

import { cn } from '@/lib/utils';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
}
    from '@/components/ui/breadcrumb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator"
import { Textarea } from '@/components/ui/textarea';

import { CalendarIcon, ChevronDown, DownloadCloudIcon, FileIcon } from 'lucide-react';
import { SocialIcon } from 'react-social-icons'

import { FileUpload } from '@/components/file-upload/file-upload';
import { Spinner } from '@/components/spinner';

import ProfileCertificatesDisplay from '@/components/displays/profileCertificatesDisplay';
import ProfileProjectsDisplay from '@/components/displays/profileProjectsDisplay';



const formSchema = z.object({
    name: z.string().min(2).max(50),
    bio: z.string().min(10),
    institutionName: z.string().min(2, "Minimum Length of 2 charcaters").max(150),
    educationLevel: z.enum(["High School", "Bachelors", "Masters"], {
        required_error: "You need to select a Education Level.",
    }),
    yearOfGrad: z.date({
        required_error: "A Graduation Daate is required.",
    }),
    skills: z.string().min(2).max(150),
    email: z.string().email(),
    resumeUrl: z.string().min(1),
    instagramLink: z.string().min(1).max(80),
    linkedInLink: z.string().min(1).max(157),
    xLink: z.string().min(1).max(150),
})

const MyProfile = () => {
    const router = useRouter();

    const { toast } = useToast();

    const [userData, setUserData] = useState<any>(null);
    const [projects, setProjects] = useState<any>(null);
    const [certificates, setCertificates] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userDataResponse, projectsResponse, certificatesResponse] = await Promise.all([
                    axios.get("/api/user"),
                    axios.get("/api/addProjects"),
                    axios.get("/api/addCertificates"),
                ]);
                setUserData(userDataResponse.data);
                setProjects(projectsResponse.data);
                setCertificates(certificatesResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            bio: "",
            institutionName: "",// or another default
            yearOfGrad: new Date(), // or a sensible default date
            skills: "",
            email: "",
            resumeUrl: "",
            instagramLink: "",
            linkedInLink: "",
            xLink: "",
        },
    });

    useEffect(() => {
        if (userData) {
            form.reset({
                name: userData.name,
                bio: userData.bio,
                institutionName: userData.InstitutionName,
                educationLevel: userData.EducationLevel,
                yearOfGrad: new Date(userData.GraduationDate),
                skills: userData.skills,
                email: userData.email,
                resumeUrl: userData.resume,
                instagramLink: userData.instagramLink,
                linkedInLink: userData.linkedInLink,
                xLink: userData.xLink,
            });
            setLoading(false);
        }
    }, [form, userData]);

    // Resume URL rendering logic
    const renderResumeUrl = () => {
        if (!userData) {
            return <FileUpload endpoint="userResume" onChange={handleResumeUpload} />;
        } else if (userData) {
            if (isEditing) {
                return <FileUpload endpoint="userResume" onChange={handleResumeUpload} />;
            } else if (userData.resume) {
                return (
                    <Link href={userData.resume}>
                        <div className="flex items-center justify-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md">
                            {userData.name}&apos;s Resume
                            <DownloadCloudIcon className='h-5 w-5 mr-2' />
                        </div>
                    </Link>
                );
            } else {
                return (
                    <div className='flex items-center justify-center h-16 bg-slate-100 rounded-md text-slate-400'>
                        <FileIcon className='h-5 w-5 text-slate-400 mr-2' />
                        No Resume Uploaded. Upload Now!!!
                    </div>
                )
            }
        } else {
            return (
                <div className='flex items-center justify-center h-16 bg-slate-100 rounded-md text-slate-400'>
                    <FileIcon className='h-5 w-5 text-slate-400 mr-2' />
                    No Resume Uploaded. Upload Now!!!
                </div>
            );
        }
    };


    // Handle resume upload
    const handleResumeUpload = (url?: string) => {
        if (url) {
            form.setValue("resumeUrl", url);
        }
    };

    // Button rendering logic
    const renderButtons = () => {
        if (userData) {
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
        } else {
            return <Button className='ml-1' onClick={() => onSubmit(form.getValues())}>Save</Button>;
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/user", values);
            router.push(`/users/${response.data.id}`);
            toast({
                title: "Congratulations",
                description: "Profile Created Successfully.",
            })
        } catch {
            toast({
                title: "Error",
                description: "Error while Creating Profile .",
            })
            console.log("[USER CREATION ERROR] Something went wrong while creating User");
        }
    }

    const onSave = async () => {
        try {
            const values = form.getValues(); // Retrieve form values
            const response = await axios.put("/api/user", values);
            window.location.reload();
            toast({
                title: "Congratulations",
                description: "Profile Updated Successfully.",
            })
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) return <div><Spinner /></div>;

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
                            <BreadcrumbPage>My Profile</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='flex'>
                    <h1 className='text-4xl font-bold font-sans'>
                        Your Profile
                    </h1>
                </div>
                <div className='flex-col lg:flex-wrap'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex-col lg:flex xl:flex-row'>
                            <div className='w-full xl:w-1/2 py-4 space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="InternVista" {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tell us about yourself" {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>
                                                Tell us a bit about yourself
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="educationLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Education Level:</FormLabel>
                                            <FormControl>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button className="ml-2" disabled={!isEditing && userData !== null}>
                                                            {field.value || "Select education level"}
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => field.onChange("High School")}>
                                                            High School
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange("Bachelors")}>
                                                            Bachelors
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange("Masters")}>
                                                            Masters
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </FormControl>
                                            <FormDescription>
                                                Your highest Level of Education right now
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="institutionName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Institution Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Rochester Institute of Technology" {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>
                                                Currently studying at or recently Graduated from
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="yearOfGrad"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Graduation Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild disabled={!isEditing && userData !== null}>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout='dropdown'
                                                        fromYear={1900}
                                                        toYear={3000}
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Your date of Graduation (Expected date if not graduated yet).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='w-full py-4 xl:px-10 space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="intern@gmail.com" {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>
                                                An Email to recieve updates and to be contacted at by the public
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="skills"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Skills</FormLabel>
                                            <FormControl>
                                                <Input placeholder="InternVista" {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>Multiple Skils Separeted by commas (eg: photography, graphic Design)</FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="instagramLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <SocialIcon url='https://www.instagram.com/' style={{ height: 40, width: 40 }} />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="www.instagram.com/..." {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display Social.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="linkedInLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <SocialIcon url='https://www.linkedin.com/' style={{ height: 40, width: 40 }} />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="www.linkedIn.com/...." {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display Social.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="xLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <SocialIcon url="https://www.x.com/" style={{ height: 40, width: 40 }} />
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="www.x.com/..." {...field} disabled={!isEditing && userData !== null} required />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display Social.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="resumeUrl"
                                    render={({ field }) => (
                                        <FormControl>
                                            <FormItem>
                                                <FormLabel>Resume</FormLabel>
                                                <FormControl>
                                                    {renderResumeUrl()}
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display resume
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        </FormControl>
                                    )}
                                />
                                {renderButtons()}
                            </div>
                        </form>
                    </Form>
                    <Separator />
                    <div>
                        <ProfileProjectsDisplay projects={projects} />
                        <ProfileCertificatesDisplay certificates={certificates} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyProfile