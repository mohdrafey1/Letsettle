"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const [allRes, pendingRes, approvedRes, rejectedRes] =
                await Promise.all([
                    fetch("/api/admin/debates?limit=1", {
                        headers: { "x-admin-token": token || "" },
                    }),
                    fetch("/api/admin/debates?status=pending&limit=1", {
                        headers: { "x-admin-token": token || "" },
                    }),
                    fetch("/api/admin/debates?status=approved&limit=1", {
                        headers: { "x-admin-token": token || "" },
                    }),
                    fetch("/api/admin/debates?status=rejected&limit=1", {
                        headers: { "x-admin-token": token || "" },
                    }),
                ]);

            const allData = await allRes.json();
            const pendingData = await pendingRes.json();
            const approvedData = await approvedRes.json();
            const rejectedData = await rejectedRes.json();

            setStats({
                total: allData.total || 0,
                pending: pendingData.total || 0,
                approved: approvedData.total || 0,
                rejected: rejectedData.total || 0,
            });
        } catch (error) {
            toast.error("Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: "Total Debates",
            value: stats.total,
            icon: TrendingUp,
            color: "blue",
        },
        {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "yellow",
        },
        {
            label: "Approved",
            value: stats.approved,
            icon: CheckCircle,
            color: "green",
        },
        {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "red",
        },
    ];

    const colorStyles: Record<string, string> = {
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                    Content moderation overview
                </p>
            </div>

            {loading ? (
                <div className="text-gray-500">Loading stats...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-lg ${
                                            colorStyles[stat.color]
                                        }`}
                                    >
                                        <Icon size={24} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/pending"
                        className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                        <h3 className="font-semibold text-gray-900">
                            Review Pending
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {stats.pending} debates waiting
                        </p>
                    </a>
                    <a
                        href="/admin/debates"
                        className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <h3 className="font-semibold text-gray-900">
                            Manage All Debates
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            View and edit debates
                        </p>
                    </a>
                    <a
                        href="/admin/options"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <h3 className="font-semibold text-gray-900">
                            Manage Options
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            View all voting options
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
}
