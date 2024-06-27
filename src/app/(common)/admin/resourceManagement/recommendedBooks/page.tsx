"use client";

import React from 'react';
import axios from "axios";


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
import useRecommendedBooks from '@/hooks/resources/useRecommendedBooks';
import OnlineBookCard from '@/components/displays/OnlineBooksCard';
import { Spinner } from '@/components/spinner';

const formSchema = z.object({
    name: z.string().min(2).max(50),
    author: z.string().min(2).max(100),
    link: z.string().min(2),
});


const RecommendedBooks = () => {
    const { toast } = useToast();

    const { recommendedBooks, loadingBooks, errorBooks } = useRecommendedBooks();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            author: "",
            link: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/recommendedBooks", values);
            toast({
                title: "Book Added"
            })
            window.location.reload();
            // Handle successful response if needed
        } catch {
            // toast.error("Something went wrong while creating")
            console.log("[ERROR] Something went wrong while creating User");
        }
    };

    if (loadingBooks) return <Spinner />

    return (
        <div className='py-4 px-6'>
            <Breadcrumb className='mb-4'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/resourceManagement">Resources Management</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Recommended Books</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='text-4xl font-bold font-sans'>
                Recommended Books
            </h1>
            <div className='flex flex-col'>
                <div className='w-full py-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name of Book</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Atomic Habits" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is publicly displayed Name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name of the author</FormLabel>
                                        <FormControl>
                                            <Input placeholder="James Clear" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is publicly displayed Description.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link of Book</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://www.atomicHabits.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is not publicly displayed.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Add Book</Button>
                        </form>
                    </Form>
                </div>
                <div className='w-full py-4'>
                    <OnlineBookCard resources={recommendedBooks} title='Recommended Books' cardDesc='Books to help you grow and develop your career' />
                </div>
            </div>
        </div>
    )
}

export default RecommendedBooks