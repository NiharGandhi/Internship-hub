"use client"

import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useRouter } from "next/navigation";

import { format } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

import { useToast } from '@/components/ui/use-toast';
import { Separator } from "@/components/ui/separator"

import { CalendarIcon, ChevronDown, DownloadCloudIcon, EllipsisVertical, FileIcon, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from '@/components/spinner';

const formSchema = z.object({
    name: z.string().min(2).max(50),
    internshipDescription: z.string().min(2),
    educationLevel: z.enum(["High School Students", "Bachelor Students", "Masters Students", "Any"], {
        required_error: "You need to select a Education Level.",
    }),
    internshipRequirement: z.string().min(2),
    paid: z.boolean().default(false),
    amountPaid: z.string().optional(),
    internshipType: z.string().min(1),
})

const InternshipEditPage = ({
    params
} : { params: { internshipId: string } }) => {

    const router = useRouter();

    const { toast } = useToast();

    const [internshipData, setInternshipData] = useState<any>(null);
    const [isPaid, setIsPaid] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // State to track loading

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const urlId = params.internshipId

    useEffect(() => {
        const fetchCompanyInternships = async () => {
            try {
                const response = await axios.get(`/api/editInternships/${urlId}`);
                setInternshipData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchCompanyInternships();
        setLoading(false);
    }, [urlId]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            internshipDescription: "",// or another default
            internshipRequirement: "",
            paid: false,
            amountPaid: "",
            internshipType: "",
        },
    });

    console.log("INRERNSHIP DATA: ", internshipData)

    useEffect(() => {
        if (internshipData) {
            form.reset({
                name: internshipData.name,
                educationLevel: internshipData.EducationLevel,
                internshipDescription: internshipData.InternshipDescription,
                internshipRequirement: internshipData.InternshipRequirement,
                paid: internshipData.Paid,
                amountPaid: internshipData.AmountPaid,
                internshipType: internshipData.InternshipType,
            })
        }
    }, [form, internshipData]);

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
            const response = await axios.post("/api/addInternships", values);
            // router.push(`/users/${response.data.id}`);
            toast({
                title: "Congratulations",
                description: "Profile Created Successfully.",
            })
            form.reset();
        } catch {
            toast({
                title: "Error",
                description: "Error while Creating Profile .",
            })
            console.log("[ERROR] Something went wrong while creating User");
        }
    };

    const onSave = async () => {
        try {
            const values = form.getValues(); // Retrieve form values
            const response = await axios.put(`/api/editInternships/${internshipData.id}`, values);
            window.location.reload();
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
            const internshipId = internshipData[index].id; // Assuming the project ID is stored in userData

            const response = await axios.delete(`/api/addInternships/${internshipId}`);

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
            const internshipId = internshipData[index].id; // Assuming the project ID is stored in userData

            router.push(`/myOrganization/createInternship/${internshipId}`)

        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the project.",
            });
        }
    };

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
                            <BreadcrumbLink href="/recruiter/myOrganization">My Organization</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      <BreadcrumbItem>
                          <BreadcrumbLink href="/recruiter/myOrganization/createInternship">All Internships</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create Internship</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className='text-4xl font-bold font-sans'>
                    Create Internship
                </h1>
                <div className='flex-col lg:flex-wrap'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex-col lg:flex lg:flex-row'>
                            <div className='w-full lg:w-1/2 md:w-1/2 py-4 space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Internship Title</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    disabled={!isEditing}
                                                    placeholder="Internship Hub" 
                                                    {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                What is the Internship Called
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
                                                    <DropdownMenuTrigger asChild disabled={!isEditing}>
                                                        <Button className="ml-2">
                                                            {field.value || "Select education level"}
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => field.onChange("Any")}>
                                                            Any
                                                        </DropdownMenuItem>
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
                                                Is the internship for: | High School Student | Bachelors Student | Master Student |
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="internshipType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Internship Type:</FormLabel>
                                            <FormControl>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild disabled={!isEditing}>
                                                        <Button className="ml-2">
                                                            {field.value || "Select Internship Type"}
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => field.onChange("on-site")}>
                                                            on-site
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange("hybrid")}>
                                                            hybrid
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange("remote")}>
                                                            remote
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </FormControl>
                                            <FormDescription>
                                                Is the internship: | on-site | hybrid | remote |
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="internshipDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Internship Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={!isEditing}
                                                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing...."
                                                    className="resize-none"
                                                    {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Brief description of the Internship
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                            </div>
                            <div className='w-full py-4 lg:px-10 md:px-10 space-y-6'>
                                <div>
                                    <h3 className="mb-4 text-lg font-medium">Paid Internship?</h3>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="paid"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Is the Internship Paid?
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            disabled={!isEditing}
                                                            checked={field.value}
                                                            onCheckedChange={(value) => {
                                                                field.onChange(value);
                                                                setIsPaid(value); // Update isPaid state
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        {isPaid && (
                                            <FormField
                                                control={form.control}
                                                name="amountPaid"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Amount Paid</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                placeholder="AED 1000, USD 100 ..."
                                                                {...field} 
                                                                disabled={!isEditing} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Amount Paid per month, with the currency
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                                {renderButtons()}
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
  )
}

export default InternshipEditPage