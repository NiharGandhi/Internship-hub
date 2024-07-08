'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { auth } from '@clerk/nextjs';

interface ConnectionButtonProps {
    targetUserId: string;
}

const sendConnectionRequest = async (targetUserId: string) => {

    try {
        const response = await axios.post('/api/checkConnection', {
            targetUserId: targetUserId
        });

        if (!response) {
            throw new Error('Failed to send connection request');
        }

        return 'Connection request sent!';
    } catch (error) {
        console.error(error);
        return 'Failed to send connection request';
    }
};

const ConnectionButton: React.FC<ConnectionButtonProps> = ({ targetUserId }) => {

    const { toast } = useToast();
    const [connection, setConnection] = useState('')

    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const response = await axios.get('/api/checkConnection', {
                    params: {
                        targetUserId: targetUserId,
                    },
                });

                if (!(response.data === null)) {
                    setConnection(response.data.status);
                    window.location.reload();
                } else {
                    setConnection("Connect")
                }

            } catch (error) {
                console.error("Error checking application status:", error);
            }
        };

        checkApplicationStatus();
    }, [targetUserId]);

    const handleClick = async () => {
        const responseMessage = await sendConnectionRequest(targetUserId);
        toast({
            title: responseMessage
        })
    };

    return (
        <div>
            <Button onClick={handleClick} disabled={connection!=="Connect"}>
                {connection}
            </Button>
        </div>
    );
};

export default ConnectionButton;
