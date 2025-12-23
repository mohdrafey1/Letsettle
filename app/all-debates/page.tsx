import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import DebateCard from "@/components/DebateCard";
import SortSelector from "@/components/SortSelector";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DEBATES_PER_PAGE = 12;

interface PageProps {
    searchParams: { page?: string; sort?: string };
}

async function getAllDebates(page: number, sortBy: string) {
    await dbConnect();

    const skip = (page - 1) * DEBATES_PER_PAGE;

    // Define sort options
    const sortOptions: Record<string, any> = {
        trending: { totalVotes: -1 },
        newest: { createdAt: -1 },
        "most-voted": { totalVotes: -1 },
    };

    const sort = sortOptions[sortBy] || sortOptions.trending;

    const [debates, total] = await Promise.all([
        Debate.find({ isActive: true, status: "approved" })
            .sort(sort)
            .skip(skip)
            .limit(DEBATES_PER_PAGE)
            .select(
                "slug title description category subCategory totalVotes createdAt"
            )
            .lean(),
        Debate.countDocuments({ isActive: true, status: "approved" }),
    ]);

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

    return {
        debates: debatesWithOptions,
        total,
        totalPages: Math.ceil(total / DEBATES_PER_PAGE),
    };
}

export const metadata = {
    title: "All Debates - Letsettle",
    description: "Browse all active debates sorted by popularity",
};

export default async function AllDebatesPage({ searchParams }: PageProps) {
    const page = parseInt(searchParams.page || "1");
    const sortBy = searchParams.sort || "trending";

    const { debates, total, totalPages } = await getAllDebates(page, sortBy);

    return (
        <div className="pb-20">
            {/* Header */}
            {/* <section 
        className="py-12 px-6 text-center"
        style={{ 
          backgroundColor: 'var(--color-base-bg)',
          borderBottom: '1px solid var(--color-base-border)'
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 
            className="font-bold tracking-tight leading-tight mb-4"
            style={{ 
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-3xl)'
            }}
          >
            All Debates
          </h1>
          <p 
            className="max-w-xl mx-auto"
            style={{ 
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)',
              lineHeight: '1.6'
            }}
          >
            Browse all active debates
          </p>
        </div>
      </section> */}

            {/* All Debates Grid */}
            <section
                className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6"
                style={{ paddingTop: "var(--space-2xl)" }}
            >
                {/* Header with Sort */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <h2
                                className="font-bold mb-2 text-base sm:text-xl"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                {total} Active Debates
                            </h2>
                            <div
                                style={{
                                    width: "60px",
                                    height: "2px",
                                    backgroundColor: "var(--color-accent)",
                                }}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-4">
                            <SortSelector />

                            <Link
                                href="/"
                                className="hidden sm:block text-sm font-medium hover:opacity-70 transition-opacity"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                ← Back to Home
                            </Link>
                            <Link
                                href="/"
                                className="sm:hidden text-sm font-medium hover:opacity-70 transition-opacity"
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                ← Back
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <SearchBar />
                </div>

                {debates.length === 0 ? (
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
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {debates.map((debate: any) => (
                                <DebateCard key={debate._id} debate={debate} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                {page > 1 && (
                                    <Link
                                        href={`/all-debates?page=${
                                            page - 1
                                        }&sort=${sortBy}`}
                                        className="px-4 py-2 text-sm font-medium transition-all hover:opacity-70"
                                        style={{
                                            border: "1px solid var(--color-base-border)",
                                            borderRadius: "var(--radius-sm)",
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        ← Previous
                                    </Link>
                                )}

                                <span
                                    className="px-4 py-2 text-sm"
                                    style={{
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    Page {page} of {totalPages}
                                </span>

                                {page < totalPages && (
                                    <Link
                                        href={`/all-debates?page=${
                                            page + 1
                                        }&sort=${sortBy}`}
                                        className="px-4 py-2 text-sm font-medium transition-all hover:opacity-70"
                                        style={{
                                            border: "1px solid var(--color-base-border)",
                                            borderRadius: "var(--radius-sm)",
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        Next →
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
