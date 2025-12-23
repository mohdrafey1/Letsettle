"use client";

import { useEffect, useState } from "react";
import { Search, Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/admin/StatusBadge";
import EditDebateModal from "@/components/admin/EditDebateModal";

interface Debate {
    _id: string;
    slug: string;
    title: string;
    description?: string;
    category: string;
    subCategory?: string;
    status: "pending" | "approved" | "rejected";
    totalVotes: number;
    isActive: boolean;
    isMoreOptionAllowed: boolean;
    rejectionReason?: string;
    createdAt: string;
    optionCount: number;
}

export default function AllDebatesPage() {
    const [debates, setDebates] = useState<Debate[]>([]);
    const [editingDebate, setEditingDebate] = useState<Debate | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchDebates();
    }, [statusFilter, currentPage]);

    const fetchDebates = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.append("status", statusFilter);
            if (search) params.append("search", search);
            params.append("page", currentPage.toString());
            params.append("limit", "20");

            const res = await fetch(`/api/admin/debates?${params.toString()}`, {
                headers: { "x-admin-token": token || "" },
            });

            const data = await res.json();
            setDebates(data.debates || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast.error("Failed to fetch debates");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page on search
        fetchDebates();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this debate?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/admin/debates/${id}`, {
                method: "DELETE",
                headers: { "x-admin-token": token || "" },
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Debate deleted");
            fetchDebates();
        } catch (error) {
            toast.error("Failed to delete debate");
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    All Debates
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage all debate submissions
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search debates..."
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Search size={18} />
                            Search
                        </button>
                    </form>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Debates Table */}
            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : debates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">No debates found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Votes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {debates.map((debate) => (
                                <tr
                                    key={debate._id}
                                    className={
                                        !debate.isActive ? "bg-gray-50" : ""
                                    }
                                >
                                    <td className="px-6 py-4">
                                        <div className="max-w-md">
                                            <div className="font-medium text-gray-900">
                                                {debate.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {debate.optionCount} options
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            {debate.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={debate.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {debate.totalVotes}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(
                                            debate.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <a
                                                href={`/debate/${debate.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </a>
                                            <button
                                                onClick={() =>
                                                    setEditingDebate(debate)
                                                }
                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(debate._id)
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="text-sm text-gray-600">
                        Showing {debates.length} of {total} debates
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

            {/* Edit Modal */}
            {editingDebate && (
                <EditDebateModal
                    debate={editingDebate}
                    onClose={() => setEditingDebate(null)}
                    onSuccess={fetchDebates}
                />
            )}
        </div>
    );
}
