"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RelatedDebate {
    _id: string;
    title: string;
    slug: string;
    category: string;
    totalVotes: number;
    createdAt: string;
    tags?: string[];
}

export default function RelatedDebates({
    debates,
}: {
    debates: RelatedDebate[];
}) {
    if (!debates || debates.length === 0) return null;

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-purple-500" size={24} />
                Related Debates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {debates.map((debate) => (
                    <Link
                        href={`/debate/${debate.slug}`}
                        key={debate._id}
                        className="group block p-4 rounded-xl border border-gray-100 hover:border-purple-100 bg-white hover:bg-purple-50/30 transition-all duration-200"
                    >
                        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
                            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                {debate.category}
                            </span>
                            <span>•</span>
                            <span>{debate.totalVotes} votes</span>
                        </div>

                        <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
                            {debate.title}
                        </h4>

                        <div className="flex items-center text-xs text-gray-400 gap-1">
                            <span>
                                {formatDistanceToNow(
                                    new Date(debate.createdAt),
                                    { addSuffix: true }
                                )}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
