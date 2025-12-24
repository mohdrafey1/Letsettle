"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Don't check auth for login page
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) {
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, [router, isLoginPage]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    // Render login page without layout
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminNav />
            <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8">{children}</main>
        </div>
    );
}
