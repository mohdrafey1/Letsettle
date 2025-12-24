"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

// Skeleton loader component
function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
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
            gradient: "from-blue-500 to-blue-600",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-600",
        },
        {
            label: "Pending Review",
            value: stats.pending,
            icon: Clock,
            gradient: "from-amber-500 to-orange-600",
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-600",
        },
        {
            label: "Approved",
            value: stats.approved,
            icon: CheckCircle,
            gradient: "from-emerald-500 to-green-600",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-600",
        },
        {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            gradient: "from-rose-500 to-red-600",
            iconBg: "bg-rose-500/10",
            iconColor: "text-rose-600",
        },
    ];

    const quickActions = [
        {
            title: "Review Pending",
            description: `${stats.pending} debates waiting for review`,
            href: "/admin/pending",
            gradient: "from-amber-500 to-orange-600",
            hoverGradient: "hover:from-amber-600 hover:to-orange-700",
            icon: Clock,
        },
        {
            title: "All Debates",
            description: "View and manage all debates",
            href: "/admin/debates",
            gradient: "from-blue-500 to-blue-600",
            hoverGradient: "hover:from-blue-600 hover:to-blue-700",
            icon: TrendingUp,
        },
        {
            title: "Manage Options",
            description: "View all voting options",
            href: "/admin/options",
            gradient: "from-purple-500 to-purple-600",
            hoverGradient: "hover:from-purple-600 hover:to-purple-700",
            icon: CheckCircle,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                    Monitor and manage your content moderation
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {loading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`p-3 rounded-xl ${stat.iconBg} transition-transform group-hover:scale-110`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 ${stat.iconColor}`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">
                                        {stat.label}
                                    </p>
                                    <p
                                        className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        Quick Actions
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <a
                                key={action.title}
                                href={action.href}
                                className={`group relative overflow-hidden bg-gradient-to-r ${action.gradient} ${action.hoverGradient} rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <Icon className="w-8 h-8 text-white" />
                                        <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">
                                        {action.title}
                                    </h3>
                                    <p className="text-white/90 text-sm">
                                        {action.description}
                                    </p>
                                </div>

                                {/* Decorative gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
