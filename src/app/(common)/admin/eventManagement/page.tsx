"use client";

import React from 'react';
import axios from "axios";

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
} from '@/components/ui/breadcrumb';

import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import AdminEventCard from './_components/AdminEventCard';
import useEvents from '@/hooks/events/useEvents';
import { Spinner } from '@/components/spinner';

const formSchema = z.object({
  title: z.string().min(2),
  dateOfEvent: z.date({
    required_error: "A Date is required.",
  }),
  description: z.string().min(2),
  link: z.string()
});


const EventManagement = () => {

  const { toast } = useToast();

  const { events, loading, error } = useEvents();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dateOfEvent: new Date(),
      description: "",
      link: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/events", values);
      toast({
        title: "Event Added"
      })
      window.location.reload();
    } catch {
      // toast.error("Something went wrong while creating")
      console.log("[ERROR] Something went wrong while creating User");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className='py-4'>
      <Breadcrumb className='mb-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Event Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className='text-4xl font-bold font-sans'>
        Event Management
      </h1>
      <div className='flex flex-col'>
        <div className='w-full py-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Hackathon..." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is publicly displayed title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfEvent"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
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
                      Your date of Event.
                    </FormDescription>
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
                      <Textarea placeholder="The Event is about..." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is publicly displayed.
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
                    <FormLabel>Registration Link (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://event...." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is publicly displayed link.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </div>
        <div className='w-full lg:py-4 md:py-4'>
          <AdminEventCard events={events} title='Upcoming Events' desc='Events you may be interested in' upcomingEventsActive={true} pastEventsActive={false}/>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
