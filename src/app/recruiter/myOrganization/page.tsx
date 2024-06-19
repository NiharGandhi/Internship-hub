"use client"

import React, { useEffect, useState } from 'react';
import axios from "axios";

import Image from 'next/image';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator"

import { FileIcon } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import CompanyInterhsipsDisplay from '@/components/displays/CompanyInternshipsDisplay';

import usePlacesAutocomplete from 'use-places-autocomplete';

import FallBack from "../../../../public/images/fallback.png";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FileUpload } from '@/components/file-upload/file-upload';


const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email("Email is required"),
    companyDescription: z.string().min(2, "A description is required"),
    companyImageUrl: z.string({message:"A Banner is required"}),
    companyLogoUrl: z.string({message: "A Logo is required"}),
    location: z.string().min(1, "Location is required."),
})

const Loader = () => (
    <div className="flex justify-center items-center h-screen">
        {/* Insert your loader SVG here */}
        <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-10 w-10 text-gray-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.764l4.065 2.329-1.346 2.338-4.119-2.371zM12 20c3.866 0 7-3.134 7-7h-4c0 2.761-2.239 5-5 5s-5-2.239-5-5H0c0 4.962 4.037 9 9 9z"></path>
        </svg>
    </div>
);

const MyProfile = () => {
    const { toast } = useToast();

    const [userData, setUserData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [internshipData, setInternshipData] = useState<any>(null);

    // Google AutoComplete
    const [open, setOpen] = React.useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");

    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({ debounce: 300 });

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleLocationInput = (e: any) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        const fetchCompanyInternships = async () => {
            try {
                const response = await axios.get("/api/addInternships");
                setInternshipData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchCompanyInternships();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/myOrganization");
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
            email: "",
            companyDescription: "",
            companyImageUrl: "",
            companyLogoUrl: "",
            location: "",
        },
    });

    useEffect(() => {
        if (userData) {
            form.reset({
                name: userData.name,
                email: userData.email,
                companyDescription: userData.CompanyDescription,
                companyImageUrl: userData.CompanyImageUrl,
                companyLogoUrl: userData.CompanyLogoUrl,
                location: userData.Location,
            });
        }
    }, [form, userData]);

    const fallbackImageUrl = FallBack;

    // Resume URL rendering logic
    const renderCompanyImage = () => {
        if (!userData) {
            return <FileUpload endpoint="companyImage" onChange={handleResumeUpload} />
        } else if (userData) {
            if (isEditing) {
                return <FileUpload endpoint="companyImage" onChange={handleResumeUpload} />;
            } else {
                return (
                    <Image
                        src={userData.CompanyImageUrl || fallbackImageUrl}
                        alt="Hero"
                        className="lg:h-[200px] rounded-xl lg:w-[1124px] w-[340px]"
                        width={1124}
                        height={200}
                    />
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

    const renderCompanyLogo = () => {
        if (!userData) {
            return <FileUpload endpoint="companyLogo" onChange={handleLogoUpload} />
        } else if (userData) {
            if (isEditing) {
                return <FileUpload endpoint="companyLogo" onChange={handleLogoUpload} />;
            } else {
                return (
                    <Image
                        src={userData.CompanyLogoUrl ||fallbackImageUrl}
                        alt="Hero"
                        className="rounded-full"
                        width={"100"}
                        height={"100"}
                    />
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
            form.setValue("companyImageUrl", url);
            onSave();
        }
    };

    const handleLogoUpload = (url?: string) => {
        if (url) {
            form.setValue("companyLogoUrl", url);
            onSave();
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
            const response = await axios.post("/api/myOrganization", values);
            // router.push(`/users/${response.data.id}`);
            toast({
                title: "Congratulations",
                description: "Profile Created Successfully.",
            })
            window.location.reload();
        } catch {
            toast({
                title: "Error",
                description: "Error while Creating Profile .",
            })
            console.log("[ERROR] Something went wrong while creating User");
        }
    }

    const onSave = async () => {
        try {
            const values = form.getValues(); // Retrieve form values
            const response = await axios.put("/api/myOrganization", values);
            // router.push(`/users/${response.data.id}`);
            toast({
                title: "Congratulations",
                description: "Profile Updated Successfully.",
            })
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <div className='py-4 px-2 lg:px-4'>
                <Breadcrumb className='mb-4'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>My Organization</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className='text-4xl font-bold font-sans'>
                    Your Organization Profile
                </h1>
                <div className='flex-col lg:flex-wrap'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
                            <FormField
                                control={form.control}
                                name="companyImageUrl"
                                render={({ field }) => (
                                    <FormControl>
                                        <FormItem>
                                            <FormLabel>Header Image</FormLabel>
                                            <FormControl>
                                                {renderCompanyImage()}
                                            </FormControl>
                                            <FormDescription>
                                                Banner for your company page.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    </FormControl>
                                )}
                            />
                            <FormField
                                    control={form.control}
                                    name="companyLogoUrl"
                                    render={({ field }) => (
                                        <FormControl>
                                            <FormItem>
                                                <FormLabel>Logo</FormLabel>
                                                <FormControl>
                                                    {renderCompanyLogo()}
                                                </FormControl>
                                                <FormDescription>
                                                    Logo of your company.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        </FormControl>
                                    )}
                                />
                            <div className='flex flex-col lg:flex-row w-auto'>
                                <div className='w-auto lg:w-1/2 md:w-1/2 py-4 space-y-6'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="InternVista" {...field} disabled={!isEditing && userData !== null} />
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
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="hr@internshiphub.com" {...field} disabled={!isEditing && userData !== null} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display email.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>

                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>About</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                                                        {...field}
                                                        className='resize-none'
                                                        disabled={!isEditing && userData !== null}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    A breif about your Company and it&apos;s mission.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>

                                        )}
                                    />
                                </div>
                                <div className='w-full py-4 lg:px-10 md:px-10 space-y-6'>
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild disabled={!isEditing && userData !== null} className='ml-2'>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={open}
                                                                className="justify-between"
                                                            >
                                                                {field.value || "Select Location"}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <Command>
                                                            <CommandInput
                                                                value={value}
                                                                placeholder="Location..."
                                                                onInput={handleLocationInput}
                                                                disabled={!ready}
                                                            />
                                                            <CommandEmpty>No Location found.</CommandEmpty>
                                                            <CommandList>
                                                                {status === "OK" && data && data.map(({ place_id, description }) => (
                                                                    <CommandItem
                                                                        key={place_id}
                                                                        value={description}
                                                                        onSelect={() => {
                                                                            form.setValue("location", description)
                                                                        }}
                                                                    >
                                                                        {description}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>
                                                    Enter the location of where you are based from.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>

                                        )}
                                    />
                                    {renderButtons()}
                                </div>
                            </div>
                        </form>
                    </Form>
                    <Separator />
                    <div>
                        <CompanyInterhsipsDisplay internships={internshipData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyProfile