import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import DebateCard from "@/components/DebateCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: { q?: string };
}

async function searchDebates(query: string) {
    await dbConnect();

    if (!query || query.trim() === "") {
        return [];
    }

    // Search in title and description
    const debates = await Debate.find({
        isActive: true,
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
        ],
    })
        .sort({ totalVotes: -1 })
        .limit(50)
        .select(
            "slug title description category subCategory totalVotes createdAt"
        )
        .lean();

    // Get options for each debate
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

export async function generateMetadata({ searchParams }: PageProps) {
    const query = searchParams.q || "";
    return {
        title: query ? `Search: ${query}` : "Search Debates",
        description: `Search results for "${query}" on Letsettle`,
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const query = searchParams.q || "";
    const results = await searchDebates(query);

    return (
        <div className="pb-20" style={{ paddingTop: "var(--space-2xl)" }}>
            {/* Search Section */}
            <section className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 mb-8">
                <div className="mb-6">
                    <h1
                        className="font-bold mb-4 text-2xl sm:text-3xl"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Search Debates
                    </h1>
                    <SearchBar />
                </div>

                {query && (
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <p
                                className="text-sm"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                {results.length > 0
                                    ? `Found ${results.length} result${
                                          results.length !== 1 ? "s" : ""
                                      } for "${query}"`
                                    : `No results found for "${query}"`}
                            </p>
                        </div>
                        <Link
                            href="/all-debates"
                            className="text-sm font-medium hover:opacity-70 transition-opacity"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            ← View All Debates
                        </Link>
                    </div>
                )}
            </section>

            {/* Results Section */}
            <section className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6">
                {!query ? (
                    // No search query yet
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
                            Start searching
                        </h3>
                        <p
                            className="mb-6"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Type in the search box above to find debates
                        </p>
                    </div>
                ) : results.length === 0 ? (
                    // No results found
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
                            No debates found
                        </h3>
                        <p
                            className="mb-6"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Try different keywords or browse all debates
                        </p>
                        <Link
                            href="/all-debates"
                            className="inline-block px-6 py-3 font-medium hover:opacity-70 transition-opacity"
                            style={{
                                backgroundColor: "var(--color-accent)",
                                color: "white",
                                borderRadius: "var(--radius-sm)",
                            }}
                        >
                            Browse All Debates
                        </Link>
                    </div>
                ) : (
                    // Results found
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((debate: any) => (
                            <DebateCard key={debate._id} debate={debate} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
