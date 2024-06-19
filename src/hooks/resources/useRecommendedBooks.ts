// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface recBook {
    id: string;
    name: string;
    author: string;
    link: string;
}

const useRecommendedBooks = () => {
    const [recommendedBooks, setRecommendedBooks] = useState<recBook[]>([]);
    const [loadingBooks, setLoadingBooks] = useState<boolean>(true);
    const [errorBooks, setErrorBooks] = useState<string | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('/api/recommendedBooks');
                setRecommendedBooks(response.data);
                // console.log(response.data);
            } catch (err) {
                setErrorBooks('Error fetching Resources data');
            } finally {
                setLoadingBooks(false);
            }
        };
        fetchResources();
    }, []);

    return { recommendedBooks, loadingBooks, errorBooks };
};

export default useRecommendedBooks;
