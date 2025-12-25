import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import DebateCard from "@/components/DebateCard";
import Hero from "@/components/Hero";
import Link from "next/link";
import { getFeaturedCategories } from "@/lib/category-config";

export const dynamic = "force-dynamic";

async function getTopDebates() {
    await dbConnect();

    const debates = await Debate.find({ isActive: true, status: "approved" })
        .sort({ totalVotes: -1 })
        .limit(6)
        .lean();

    const debatesWithOptions = await Promise.all(
        debates.map(async (debate) => {
            const topOptions = await Option.find({ debateId: debate._id })
                .sort({ votes: -1 })
                .limit(3)
                .lean();
            return {
                ...debate,
                options: topOptions,
                _id: debate._id.toString(),
            };
        })
    );

    return debatesWithOptions;
}

export default async function Home() {
    const topDebates = await getTopDebates();

    return (
        <div className="pb-20" style={{ paddingTop: "var(--space-3xl)" }}>
            {/* Hero Section - Minimal & Calm */}
            <Hero />

            {/* Top Debates */}
            <section
                id="trending"
                className="max-w-6xl mx-auto px-6"
                style={{ paddingTop: "var(--space-3xl)" }}
            >
                <div className="flex items-center mb-8">
                    <div>
                        <h2
                            className="font-bold mb-2"
                            style={{
                                color: "var(--color-text-primary)",
                                fontSize: "var(--font-size-2xl)",
                            }}
                        >
                            Trending Debates
                        </h2>
                        <div
                            style={{
                                width: "60px",
                                height: "2px",
                                backgroundColor: "var(--color-accent)",
                            }}
                        />
                    </div>
                    <Link
                        href="/all-debates"
                        className="ml-auto text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        View All →
                    </Link>
                </div>

                {topDebates.length === 0 ? (
                    <div
                        className="text-center py-20"
                        style={{
                            border: "1px dashed var(--color-base-border)",
                            borderRadius: "var(--radius-sm)",
                        }}
                    >
                        <h3
                            className="font-medium mb-2"
                            style={{
                                color: "var(--color-text-primary)",
                                fontSize: "var(--font-size-lg)",
                            }}
                        >
                            No debates yet
                        </h3>
                        <p
                            className="mb-6"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Be the first to start one.
                        </p>
                        <Link
                            href="/create"
                            className="font-medium hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-accent)" }}
                        >
                            Create a Debate →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topDebates.map((debate: any) => (
                            <DebateCard key={debate._id} debate={debate} />
                        ))}
                    </div>
                )}
            </section>

            {/* Categories Preview */}
            <section
                className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6"
                style={{ paddingTop: "var(--space-3xl)" }}
            >
                <div className="flex items-center mb-8">
                    <h2
                        className="font-bold"
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "var(--font-size-2xl)",
                        }}
                    >
                        Categories
                    </h2>
                    <Link
                        href="/categories"
                        className="ml-auto text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        View All →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getFeaturedCategories().map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.name}
                                href={`/category/${category.name.toLowerCase()}`}
                                className="group p-6 text-center transition-all hover-accent-border"
                                style={{
                                    backgroundColor:
                                        "var(--color-base-surface)",
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
                                    className="font-medium"
                                    style={{
                                        color: "var(--color-text-primary)",
                                        fontSize: "var(--font-size-base)",
                                    }}
                                >
                                    {category.name}
                                </h3>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
