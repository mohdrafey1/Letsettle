"use client";

import { useEffect, useState } from "react";

interface AdminEditButtonProps {
    debateTitle: string;
}

export default function AdminEditButton({ debateTitle }: AdminEditButtonProps) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if admin token exists
        const token = localStorage.getItem("adminToken");
        setIsAdmin(!!token);
    }, []);

    if (!isAdmin) return null;

    return (
        <a
            href={`/admin/debates?search=${encodeURIComponent(debateTitle)}`}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            style={{
                backgroundColor: "var(--color-accent-light)",
                color: "var(--color-accent)",
            }}
        >
            Edit
        </a>
    );
}
