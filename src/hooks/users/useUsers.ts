// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import {type User} from '@prisma/client'


const useUsers = (currentPage: number, usersPerPage: number, searchQuery: string, skill: string, institution: string, educationLevel: string) => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [meta, setMeta] = useState();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [skills, setSkills] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/allUsers', {
                    params: {
                        take: usersPerPage,
                        skip: (currentPage - 1) * usersPerPage,
                        searchQuery,
                        skill,
                        institution,
                        educationLevel
                    }
                });
                setMeta(response.data.metadata);
                setUsers(response.data.allUsers);
                setTotal(response.data.count);
                setSkills(response.data.allSkills);
                setInstitutions(response.data.allInstitutions)
                setEducationLevels(response.data.allEducationLevels)
            } catch (err) {
                setError('Error fetching Users');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [currentPage, usersPerPage, searchQuery, skill, institution, educationLevel]);

    return { 
        users, 
        loading, 
        error,
        meta,
        total,
        skills,
        institutions,
        educationLevels
    };
};

export default useUsers;
