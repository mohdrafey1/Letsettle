import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CATEGORY_CONFIGS } from "@/lib/category-config";

export const metadata = {
    title: "Categories - Letsettle",
};

export default function CategoriesIndex() {
    return (
        <div
            className="max-w-6xl mx-auto px-4 pb-20"
            style={{ paddingTop: "var(--space-3xl)" }}
        >
            <Link
                href="/"
                className="inline-flex items-center mb-8 font-medium hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-text-secondary)" }}
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Home
            </Link>

            <div className="mb-12">
                <h1
                    className="font-bold mb-2"
                    style={{
                        color: "var(--color-text-primary)",
                        fontSize: "var(--font-size-3xl)",
                    }}
                >
                    Browse Categories
                </h1>
                <div
                    style={{
                        width: "80px",
                        height: "3px",
                        backgroundColor: "var(--color-accent)",
                    }}
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {CATEGORY_CONFIGS.map((category) => {
                    const Icon = category.icon;
                    return (
                        <Link
                            key={category.name}
                            href={`/category/${category.name.toLowerCase()}`}
                            className="group p-6 text-center transition-all hover-accent-border"
                            style={{
                                backgroundColor: "var(--color-base-surface)",
                                border: "1px solid var(--color-base-border)",
                                borderRadius: "var(--radius-sm)",
                            }}
                        >
                            <div
                                className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{
                                    backgroundColor: category.bgColor,
                                }}
                            >
                                <Icon
                                    size={24}
                                    style={{ color: category.color }}
                                    strokeWidth={2}
                                />
                            </div>
                            <h3
                                className="font-medium text-sm"
                                style={{
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {category.name}
                            </h3>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
