// components/UpdateStatusButton.js
"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';

const ApplicationStatusLabel = ({ applicationId }: {
    applicationId: string
}) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('PENDING'); // Initial status
    const { toast } = useToast();

    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const response = await axios.get('/api/applicationStatus', {
                    params: {
                        applicationId: applicationId
                    },
                });

                if ((response.data === "ACCEPTED")) {
                    setStatus("ACCEPTED");
                }
                else if (response.data === "REJECTED") {
                    setStatus("REJECTED");
                }
                else {
                    setStatus("PENDING");
                }
            } catch (error) {
                console.error("Error checking application status:", error);
            }
        };

        checkApplicationStatus();
    }, [applicationId]);

    const updateStatus = async (newStatus:string) => {
        setLoading(true);

        try {
            await axios.post('/api/applicationStatus', {
                applicationId: applicationId,
                status: newStatus,
            });

            setStatus(newStatus); // Update the status in the component state

            toast({
                title: "Status Updated",
                description: `Application status updated to ${newStatus}`,
            });
        } catch (error) {
            toast({
                title: "Error Updating Status",
                description: "Try again later",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ml-2'>
            {status === "PENDING" && (
                <Badge className='bg-slate-400'>{status}</Badge>
            )}
            {status === "ACCEPTED" && (
                <Badge className='bg-green-400'>{status}</Badge>
            )}
            {status === "REJECTED" && (
                <Badge className='bg-red-400'>{status}</Badge>
            )}
            
        </div>
    );
};

export default ApplicationStatusLabel;
