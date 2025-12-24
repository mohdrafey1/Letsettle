"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";

interface Debate {
    _id: string;
    slug: string;
    title: string;
    description?: string;
    category: string;
    subCategory?: string;
    isActive: boolean;
    isMoreOptionAllowed: boolean;
    status: "pending" | "approved" | "rejected";
    rejectionReason?: string;
}

interface EditDebateModalProps {
    debate: Debate;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditDebateModal({
    debate,
    onClose,
    onSuccess,
}: EditDebateModalProps) {
    const [formData, setFormData] = useState({
        title: debate.title,
        description: debate.description || "",
        category: debate.category,
        subCategory: debate.subCategory || "",
        isActive: debate.isActive,
        isMoreOptionAllowed: debate.isMoreOptionAllowed,
        status: debate.status,
        rejectionReason: debate.rejectionReason || "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`/api/admin/debates/${debate._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-token": token || "",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update debate");
            }

            toast.success("Debate updated successfully");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
                {/* <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Edit Debate
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div> */}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Slug (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug (Read-only)
                        </label>
                        <input
                            type="text"
                            value={debate.slug}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Optional description..."
                        />
                    </div>

                    {/* Category & Subcategory */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subcategory
                            </label>
                            <input
                                type="text"
                                value={formData.subCategory}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        subCategory: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Optional subcategory..."
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value as any,
                                })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Rejection Reason (only show if status is rejected) */}
                    {formData.status === "rejected" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rejection Reason
                            </label>
                            <textarea
                                rows={2}
                                value={formData.rejectionReason}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        rejectionReason: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Reason for rejection..."
                            />
                        </div>
                    )}

                    {/* Checkboxes */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isActive: e.target.checked,
                                    })
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor="isActive"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                Active (visible to users)
                            </label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isMoreOptionAllowed"
                                checked={formData.isMoreOptionAllowed}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isMoreOptionAllowed: e.target.checked,
                                    })
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor="isMoreOptionAllowed"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                Allow users to add more options
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
