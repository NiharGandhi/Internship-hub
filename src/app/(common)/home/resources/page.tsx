"use client";

import React from 'react';

import { 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';



import useOnlineResources from '@/hooks/resources/useOnlineResource';
import useRecommendedBooks from '@/hooks/resources/useRecommendedBooks';
import useUsefulTool from '@/hooks/resources/useTool';
import ResourceCard from '@/components/displays/ResourceCard';
import OnlineBookCard from '@/components/displays/OnlineBooksCard';
import UsefulToolCard from '@/components/displays/UsefulToolCard';
import { Spinner } from '@/components/spinner';




const ResourcesPage = () => {
    const { onlineResources, loadingRes, errorRes } = useOnlineResources();
    const { recommendedBooks, loadingBooks, errorBooks } = useRecommendedBooks();
    const { usefulTools, loadingTools, errorTools } = useUsefulTool();

    if (loadingRes || loadingBooks || loadingTools) {
        return <Spinner />
    }

    return (
        <div>
            <Breadcrumb className='mt-3 ml-10'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Resources</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='font-bold text-4xl mt-2 px-10'>Resources</h1>
            <div className="flex flex-col">
                <main className="flex-1 lg:p-6 px-4 py-4">
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <ResourceCard resources={onlineResources} title='Online Resouces' cardDesc='Useful links and resources for interns' />
                            <OnlineBookCard resources={recommendedBooks} title='Recommended Books' cardDesc='Books to help you grow and develop your career' />
                            <UsefulToolCard resources={usefulTools} title='Useful Tools' cardDesc='Productivity and collaboration tools for interns' />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ResourcesPage