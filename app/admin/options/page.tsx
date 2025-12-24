"use client";

import { useEffect, useState } from "react";
import { Trash2, ExternalLink, Package } from "lucide-react";
import { toast } from "sonner";

interface Option {
    _id: string;
    debateId: string;
    name: string;
    votes: number;
    createdAt: string;
    debateTitle?: string;
    debateSlug?: string;
}

interface DebateGroup {
    debateId: string;
    options: Option[];
}

export default function OptionsPage() {
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchOptions();
    }, [currentPage]);

    const fetchOptions = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const params = new URLSearchParams();
            params.append("page", currentPage.toString());
            params.append("limit", "50");

            const res = await fetch(`/api/admin/options?${params.toString()}`, {
                headers: { "x-admin-token": token || "" },
            });

            const data = await res.json();
            setOptions(data.options || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast.error("Failed to fetch options");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this option?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/admin/options/${id}`, {
                method: "DELETE",
                headers: { "x-admin-token": token || "" },
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Option deleted");
            fetchOptions();
        } catch (error) {
            toast.error("Failed to delete option");
        }
    };

    // Group options by debate
    const groupedOptions = options.reduce((acc, option) => {
        const key = option.debateId.toString();
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(option);
        return acc;
    }, {} as Record<string, Option[]>);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Manage Options
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                    View and manage all voting options
                </p>
            </div>

            {/* Stats Banner */}
            {!loading && (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/90 text-sm font-medium mb-1">
                                Total Options
                            </p>
                            <p className="text-4xl font-bold">{total}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl">
                            <Package className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading options...</p>
                </div>
            ) : options.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No options found
                    </h3>
                    <p className="text-gray-600">
                        There are no voting options to display
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedOptions).map(
                        ([debateId, debateOptions]) => (
                            <div
                                key={debateId}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {debateOptions[0]?.debateTitle ||
                                                `Debate ID: ${debateId}`}
                                        </h3>
                                        <p className="text-sm text-gray-600 font-medium">
                                            {debateOptions.length} option
                                            {debateOptions.length !== 1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>
                                    {debateOptions[0]?.debateSlug && (
                                        <a
                                            href={`/debate/${debateOptions[0].debateSlug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
                                        >
                                            <ExternalLink size={16} />
                                            <span>View Debate</span>
                                        </a>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {debateOptions.map((option) => (
                                        <div
                                            key={option._id}
                                            className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 mb-1 truncate">
                                                    {option.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold text-purple-600">
                                                        {option.votes}
                                                    </span>{" "}
                                                    votes • Added{" "}
                                                    {new Date(
                                                        option.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleDelete(option._id)
                                                }
                                                className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete option"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100 p-4 gap-4">
                    <div className="text-sm text-gray-600 font-medium">
                        Showing {options.length} of {total} options
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700 font-semibold flex items-center">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
