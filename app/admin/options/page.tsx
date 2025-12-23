"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
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
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Options
                </h1>
                <p className="text-gray-500 mt-1">
                    View and manage all voting options
                </p>
            </div>

            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : options.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">No options found</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedOptions).map(
                        ([debateId, debateOptions]) => (
                            <div
                                key={debateId}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {debateOptions[0]?.debateTitle ||
                                                `Debate ID: ${debateId}`}
                                        </h3>
                                        <p className="text-sm text-gray-500">
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
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            View Debate →
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {debateOptions.map((option) => (
                                        <div
                                            key={option._id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {option.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {option.votes} votes • Added{" "}
                                                    {new Date(
                                                        option.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleDelete(option._id)
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="text-sm text-gray-600">
                        Showing {options.length} of {total} options
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
