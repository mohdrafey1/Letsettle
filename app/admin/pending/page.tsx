"use client";

import { useEffect, useState } from "react";
import { Check, X, Eye } from "lucide-react";
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
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Pending Debates
                </h1>
                <p className="text-gray-500 mt-1">
                    Review and moderate debate submissions
                </p>
            </div>

            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : debates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">No pending debates</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {debates.map((debate) => (
                        <div
                            key={debate._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {debate.title}
                                        </h3>
                                        <StatusBadge status={debate.status} />
                                    </div>

                                    {debate.description && (
                                        <p className="text-gray-600 mb-3">
                                            {debate.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                            {debate.category}
                                        </span>
                                        {debate.subCategory && (
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                                {debate.subCategory}
                                            </span>
                                        )}
                                        <span>
                                            {debate.optionCount} options
                                        </span>
                                        <span>
                                            Submitted:{" "}
                                            {new Date(
                                                debate.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                        {debate.createdBy && (
                                            <span>By: {debate.createdBy}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() =>
                                            handleApprove(debate._id)
                                        }
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        title="Approve"
                                    >
                                        <Check size={18} />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            openRejectModal(debate._id)
                                        }
                                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        title="Reject"
                                    >
                                        <X size={18} />
                                        <span>Reject</span>
                                    </button>
                                    <a
                                        href={`/debate/${debate._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Reject Debate
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Optionally provide a reason for rejection:
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
                            rows={4}
                            placeholder="e.g., Violates community guidelines, spam content, etc."
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Confirm Rejection
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason("");
                                    setSelectedDebate(null);
                                }}
                                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
