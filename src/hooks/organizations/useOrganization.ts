// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Company, CreateInternship } from '@/types/interfaces';


const useOrganization = ({ orgId }: { orgId: string }) => {
    const [organization, setOrganization] = useState<Company>();
    const [internships, setInternships] = useState<CreateInternship[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/getOrganization', {
                    params: {
                        orgId: orgId
                    }
                });
                setOrganization(response.data.company);
                setInternships(response.data.internships)
            } catch (err) {
                console.log(err);
                setError('Error fetching Organization');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [orgId]);

    return { organization, internships, loading, error };
};

export default useOrganization;
