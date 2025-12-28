"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Trash2,
    AlertCircle,
    Sparkles,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";
import MagicSkeleton from "@/components/MagicSkeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateDebatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [rateLimitError, setRateLimitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        subCategory: "",
        isMoreOptionAllowed: true,
    });

    const [options, setOptions] = useState(["", ""]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleAIAutoFill = async () => {
        if (!formData.title.trim()) {
            toast.error("Please enter a topic in the title field first");
            return;
        }

        setIsGenerating(true);
        setRateLimitError("");
        setError("");

        try {
            const res = await fetch("/api/ai/autocomplete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: formData.title }),
            });

            const data = await res.json();

            if (res.status === 429) {
                setRateLimitError(
                    "You've reached your daily limit of 3 AI generations. Please try again tomorrow or fill the form manually."
                );
                toast.error("Daily AI limit reached 🛑");
                setIsGenerating(false);
                return;
            }

            if (!res.ok) throw new Error(data.error || "Failed to generate");

            // Add a small artificial delay to show off the skeleton if the API is too fast
            await new Promise((resolve) => setTimeout(resolve, 800));

            setFormData((prev) => ({
                ...prev,
                title: data.title,
                description: data.description,
                category: data.category,
                subCategory: data.subCategory,
            }));
            setOptions(data.options);
            toast.success("Form auto-filled with AI magic! ✨");
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to auto-fill form. Please try again."
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!formData.title || !formData.category) {
            setError("Please fill in required fields.");
            return;
        }
        if (options.some((opt) => !opt.trim())) {
            setError("All option fields must be filled.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/debate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    options: options.filter((o) => o.trim()),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setIsSuccess(true);
            toast.success(data.message || "Debate submitted successfully!");

            // Redirect to home after delay
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 2000);
        } catch (err) {
            const msg = (err as Error).message;
            setError(msg);
            toast.error(msg);
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-50 p-6 rounded-full mb-6"
                >
                    <CheckCircle2 size={64} className="text-green-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Debate Created!
                </h2>
                <p className="text-gray-500 mb-8">
                    Redirecting you to the feed...
                </p>
                <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-green-500"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Start a New Debate
                </h1>
                <p className="text-gray-500 mb-8">
                    Pose a question, add options, and let the world vote.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {rateLimitError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-orange-50 text-orange-700 border border-orange-100 p-4 rounded-lg mb-6 flex items-start gap-3"
                    >
                        <AlertCircle
                            size={20}
                            className="mt-0.5 flex-shrink-0"
                        />
                        <div>
                            <p className="font-medium">Daily Limit Reached</p>
                            <p className="text-sm opacity-90 mt-1">
                                {rateLimitError}
                            </p>
                        </div>
                    </motion.div>
                )}

                <div className="relative">
                    {/* Form Content */}

                    <form
                        onSubmit={handleSubmit}
                        className={`space-y-6 transition-opacity duration-300 ${
                            isGenerating
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
                    >
                        {/* Debate Info */}
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Debate Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAIAutoFill}
                                        disabled={
                                            isGenerating || !!rateLimitError
                                        }
                                        className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles size={14} />
                                        Auto-fill with AI
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Best Programming Language for 2024"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subcategory (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Cricket, AI, Movies"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        value={formData.subCategory}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                subCategory: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Add context to your debate..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    maxLength={500}
                                />
                            </div>

                            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="isMoreOptionAllowed"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    checked={formData.isMoreOptionAllowed}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isMoreOptionAllowed:
                                                e.target.checked,
                                        })
                                    }
                                />
                                <label
                                    htmlFor="isMoreOptionAllowed"
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    Allow users to suggest more options after
                                    creation
                                </label>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Options */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Voting Options (Min 2){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                {options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-gray-400 text-sm font-mono w-6">
                                            #{idx + 1}
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            placeholder={`Option ${idx + 1}`}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            value={opt}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    idx,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeOption(idx)
                                                }
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addOption}
                                className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Plus size={16} />
                                Add Another Option
                            </button>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || isSuccess}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2
                                            className="animate-spin"
                                            size={20}
                                        />
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    "Create Debate"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Skeleton Overlay */}
                    <AnimatePresence>
                        {isGenerating && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white z-10"
                            >
                                <MagicSkeleton />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
