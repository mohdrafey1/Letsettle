import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CATEGORIES } from "@/lib/constants";

export const metadata = {
    title: "Categories - Letsettle",
};

export default function CategoriesIndex() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" />
                Back to Home
            </Link>
            <h1 className="sm:text-4xl font-bold text-gray-900 mb-10">
                Browse Categories
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat}
                        href={`/category/${cat}`}
                        className="p-8 bg-white border border-gray-200 rounded-2xl text-center hover:shadow-lg hover:border-blue-200 hover:text-blue-600 transition-all group"
                    >
                        <span className="sm:text-xl font-bold group-hover:scale-110 inline-block transition-transform">
                            {cat}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
