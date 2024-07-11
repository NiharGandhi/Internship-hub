// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Certificate, Project, User } from '@/types/interfaces';


const useUserDetail = ({ userId }: { userId : string }) => {
    const [user, setUser] = useState<User | null>();
    const [userProjects, setUserProjects] = useState([]);
    const [userCertificates, setUserCertificates] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/getUserDetail', {
                    params: {
                        userId: userId
                    }
                });
                setUser(response.data.user);
                setUserProjects(response.data.projects);
                setUserCertificates(response.data.certificates);
            } catch (err) {
                setError('Error fetching User Details');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    return { user, userProjects, userCertificates, loading, error };
};

export default useUserDetail;
