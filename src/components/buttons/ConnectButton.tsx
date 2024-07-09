'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '../ui/use-toast';

import { Knock } from "@knocklabs/node";
import { useUser } from '@clerk/nextjs';

const KnockSecret = String(process.env.NEXT_PUBLIC_KNOCK_API_KEY)

const knockClient = new Knock("sk_ylMYMj2CN3mm6F2l--Xkqg-5gBI1LVm3n85-2E6UAok");

interface ConnectionButtonProps {
    targetUserId: string;
    knockReceiverId: string;
};

const sendConnectionRequest = async (targetUserId: string, knockReceiverId: string) => {

    try {
        const response = await axios.post('/api/checkConnection', {
            targetUserId: targetUserId
        });

        console.log("TG: ", targetUserId);

        const sender = await axios.get('/api/user');

        await knockClient.workflows.trigger('connect-request', {
            data: {
                connectReqUrl: "https://www.internvista.tech/connects"
            },
            recipients: [
                {
                    id: knockReceiverId,
                    name: sender.data.name,
                }
            ],
        })

        if (!response) {
            throw new Error('Failed to send connection request');
        }

        return 'Connection request sent!';
    } catch (error) {
        console.error(error);
        return 'Failed to send connection request';
    }
};

const ConnectionButton: React.FC<ConnectionButtonProps> = ({ targetUserId, knockReceiverId }) => {

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
        const responseMessage = await sendConnectionRequest(targetUserId, knockReceiverId);
        toast({
            title: responseMessage
        })
        window.location.reload();
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
