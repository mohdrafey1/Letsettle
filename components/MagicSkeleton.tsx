import { motion } from "framer-motion";

export default function MagicSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Title Skeleton */}
            <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
            </div>

            {/* Category & SubCategory Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
                </div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-24 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
            </div>

            {/* Options Skeleton */}
            <div className="space-y-3">
                <div className="h-4 w-40 bg-gray-200 rounded mb-4"></div>
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="h-4 w-6 bg-gray-200 rounded"></div>
                        <div className="h-10 flex-1 bg-gray-100 rounded-lg border border-gray-200"></div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <div className="text-sm text-purple-600 font-medium flex items-center gap-2">
                    <span className="animate-bounce">✨</span> Generating
                    magic...
                </div>
            </div>
        </div>
    );
}
