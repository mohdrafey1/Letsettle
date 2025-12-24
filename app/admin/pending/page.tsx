"use client";

import { useEffect, useState } from "react";
import { Check, X, Eye, Calendar, Tag } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/admin/StatusBadge";

interface Debate {
    _id: string;
    title: string;
    description?: string;
    category: string;
    subCategory?: string;
    status: "pending" | "approved" | "rejected";
    createdBy?: string;
    createdAt: string;
    optionCount: number;
}

function DebateCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

export default function PendingDebatesPage() {
    const [debates, setDebates] = useState<Debate[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedDebate, setSelectedDebate] = useState<string | null>(null);

    useEffect(() => {
        fetchDebates();
    }, []);

    const fetchDebates = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(
                "/api/admin/debates?status=pending&limit=100",
                {
                    headers: { "x-admin-token": token || "" },
                }
            );

            const data = await res.json();
            setDebates(data.debates || []);
        } catch (error) {
            toast.error("Failed to fetch debates");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/admin/debates/${id}/approve`, {
                method: "POST",
                headers: { "x-admin-token": token || "" },
            });

            if (!res.ok) throw new Error("Failed to approve");

            toast.success("Debate approved");
            fetchDebates();
        } catch (error) {
            toast.error("Failed to approve debate");
        }
    };

    const handleReject = async () => {
        if (!selectedDebate) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(
                `/api/admin/debates/${selectedDebate}/reject`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-token": token || "",
                    },
                    body: JSON.stringify({ reason: rejectionReason }),
                }
            );

            if (!res.ok) throw new Error("Failed to reject");

            toast.success("Debate rejected");
            setShowRejectModal(false);
            setRejectionReason("");
            setSelectedDebate(null);
            fetchDebates();
        } catch (error) {
            toast.error("Failed to reject debate");
        }
    };

    const openRejectModal = (id: string) => {
        setSelectedDebate(id);
        setShowRejectModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Pending Debates
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                    Review and moderate debate submissions
                </p>
            </div>

            {/* Stats Banner */}
            {!loading && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/90 text-sm font-medium mb-1">
                                Awaiting Review
                            </p>
                            <p className="text-4xl font-bold">
                                {debates.length}
                            </p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl">
                            <Calendar className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            )}

            {/* Debates List */}
            {loading ? (
                <div className="space-y-4">
                    <DebateCardSkeleton />
                    <DebateCardSkeleton />
                    <DebateCardSkeleton />
                </div>
            ) : debates.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        All caught up!
                    </h3>
                    <p className="text-gray-600">
                        No pending debates to review
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {debates.map((debate) => (
                        <div
                            key={debate._id}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {debate.title}
                                        </h3>
                                        <StatusBadge status={debate.status} />
                                    </div>

                                    {debate.description && (
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {debate.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium">
                                            <Tag className="w-4 h-4" />
                                            {debate.category}
                                        </span>
                                        {debate.subCategory && (
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium">
                                                {debate.subCategory}
                                            </span>
                                        )}
                                        <span className="text-gray-600">
                                            <span className="font-semibold">
                                                {debate.optionCount}
                                            </span>{" "}
                                            options
                                        </span>
                                        <span className="text-gray-500">
                                            {new Date(
                                                debate.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                        {debate.createdBy && (
                                            <span className="text-gray-500">
                                                By:{" "}
                                                <span className="font-medium">
                                                    {debate.createdBy}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                                    <button
                                        onClick={() =>
                                            handleApprove(debate._id)
                                        }
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-emerald-500/30"
                                        title="Approve"
                                    >
                                        <Check size={18} />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            openRejectModal(debate._id)
                                        }
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-rose-500/30"
                                        title="Reject"
                                    >
                                        <X size={18} />
                                        <span>Reject</span>
                                    </button>
                                    <a
                                        href={`/debate/${debate._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition-colors"
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Reject Debate
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Optionally provide a reason for rejection:
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none mb-4 transition-all"
                            rows={4}
                            placeholder="e.g., Violates community guidelines, spam content, etc."
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-4 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-rose-500/30"
                            >
                                Confirm Rejection
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason("");
                                    setSelectedDebate(null);
                                }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
