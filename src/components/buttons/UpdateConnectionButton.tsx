// components/UpdateConnectionStatus.js

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const UpdateConnectionStatus = ({ connectionId }: { connectionId: string }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('PENDING'); // Initial status

    const { toast } = useToast();

    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const response = await axios.get('/api/connectionStatus', {
                    params: { connectionId }
                });

                const newStatus = response.data;
                setStatus(newStatus);
            } catch (error) {
                console.error("Error checking application status:", error);
            }
        };

        checkApplicationStatus();
    }, [connectionId]);

    const updateStatus = async (newStatus : string) => {
        setLoading(true);

        try {
            if (newStatus === "ACCEPTED" || newStatus === "PENDING") {
                await axios.post('/api/connectionStatus', {
                    connectionId,
                    status: newStatus
                });

                setStatus(newStatus); // Update the status in the component state

                toast({
                    title: "Status Updated",
                    description: `Connection status updated to ${newStatus}`
                });
            } else if (newStatus === "REJECTED") {
                await axios.post('/api/deleteConnection', {
                    id: connectionId
                });

                toast({
                    title: "Connect Successfully Deleted"
                })

                window.location.reload();

            }
        } catch (error) {
            toast({
                title: "Error Updating Status",
                description: "Try again later"
            });
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusButtonStyle = () => {
        let buttonStyle = '';

        switch (status) {
            case 'PENDING':
                buttonStyle = 'bg-slate-400';
                break;
            case 'ACCEPTED':
                buttonStyle = 'bg-green-400';
                break;
            case 'REJECTED':
                buttonStyle = 'bg-red-400';
                break;
            default:
                buttonStyle = 'bg-slate-400';
        }

        return buttonStyle;
    };

    return (
        <div className='ml-2'>
            <DropdownMenu>
                <DropdownMenuTrigger className='ml-auto' disabled={loading}>
                    <Button className={getStatusButtonStyle()} variant='outline'>
                        {status}
                        <ChevronDown className='ml-1 w-6 h-6' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => updateStatus('PENDING')} className='text-slate-500'>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('ACCEPTED')} className='text-green-500'>Accept</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('REJECTED')} className='text-red-500'>Reject</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default UpdateConnectionStatus;
