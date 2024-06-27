"use client";

import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const TeacherLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [userRole, setUserRole] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/user");
            setUserRole(response.data.role);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        };
        fetchUserData();
    }, []);
    
    // console.log("Bool", userRole !== "ADMIN");

    if (userRole==="USER") {
        return redirect("/")
    }

    return (
        <>
            {children}
        </>
    )
}

export default TeacherLayout;