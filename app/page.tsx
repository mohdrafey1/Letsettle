import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import DebateCard from "@/components/DebateCard";
import HeroDebateDemo from "@/components/HeroDebateDemo";
import Link from "next/link";

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
            <section
                className="pt-8 pb-16 px-6 text-center"
                style={{
                    backgroundColor: "var(--color-base-bg)",
                    borderBottom: "1px solid var(--color-base-border)",
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Left: Content */}
                    <div className="text-left space-y-8">
                        <h1
                            className="font-bold tracking-tight leading-none"
                            style={{
                                color: "var(--color-text-primary)",
                                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                                marginBottom: "var(--space-md)",
                            }}
                        >
                            Settle The
                            <br />
                            <span style={{ color: "var(--color-accent)" }}>
                                Unsettled
                            </span>
                        </h1>
                        <p
                            className="max-w-xl"
                            style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "var(--font-size-lg)",
                                lineHeight: "1.6",
                            }}
                        >
                            The public voting platform where opinions turn into
                            data. Vote on trending debates or start your own.
                        </p>

                        {/* Search Bar */}
                        {/* <div className="max-w-md relative group">
                            <div
                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                style={{ color: "var(--color-text-tertiary)" }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search topic..."
                                className="w-full py-4 pl-12 pr-4 rounded-full outline-none transition-all shadow-sm focus:shadow-md"
                                style={{
                                    backgroundColor:
                                        "var(--color-base-surface)",
                                    border: "1px solid var(--color-base-border)",
                                    color: "var(--color-text-primary)",
                                    fontSize: "var(--font-size-base)",
                                }}
                            />
                        </div> */}

                        <div className="pt-2 flex items-center gap-6">
                            <Link
                                href="/create"
                                className="font-medium transition-opacity hover:opacity-70 flex items-center gap-2"
                                style={{
                                    color: "var(--color-accent)",
                                    fontSize: "var(--font-size-base)",
                                }}
                            >
                                Start a Debate
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/all-debates"
                                className="font-medium transition-opacity hover:opacity-70 flex items-center gap-2"
                                style={{
                                    fontSize: "var(--font-size-base)",
                                }}
                            >
                                Explore Debates
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Live Demo Card */}
                    <div className="relative hidden lg:block">
                        <HeroDebateDemo />
                    </div>
                </div>
            </section>

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
                    {["Sports", "Technology", "Politics", "Entertainment"].map(
                        (cat) => (
                            <Link
                                key={cat}
                                href={`/category/${cat.toLowerCase()}`}
                                className="p-6 text-center transition-all hover-accent-border"
                                style={{
                                    backgroundColor:
                                        "var(--color-base-surface)",
                                    border: "1px solid var(--color-base-border)",
                                    borderRadius: "var(--radius-sm)",
                                }}
                            >
                                <h3
                                    className="font-medium"
                                    style={{
                                        color: "var(--color-text-primary)",
                                        fontSize: "var(--font-size-base)",
                                    }}
                                >
                                    {cat}
                                </h3>
                            </Link>
                        )
                    )}
                </div>
            </section>
        </div>
    );
}
