// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Company, CreateInternship } from '@/types/interfaces';


const useInternshipPage = ({ internshipId }: { internshipId: string }) => {
    const [organization, setOrganization] = useState<Company>();
    const [internship, setInternship] = useState<CreateInternship>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/getInternshipDetails', {
                    params: {
                        internshipId: internshipId
                    }
                });
                setOrganization(response.data.company);
                setInternship(response.data.internship)
            } catch (err) {
                console.log(err);
                setError('Error fetching Organization');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [internshipId]);

    return { organization, internship, loading, error };
};

export default useInternshipPage;
