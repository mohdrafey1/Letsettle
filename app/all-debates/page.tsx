import dbConnect from "@/lib/db";
import Debate from "@/models/Debate";
import Option from "@/models/Option";
import DebateCard from "@/components/DebateCard";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getAllDebates() {
  await dbConnect();
  
  const debates = await Debate.find({ isActive: true })
    .sort({ totalVotes: -1 })
    .lean();

  const debatesWithOptions = await Promise.all(
    debates.map(async (debate) => {
      const topOptions = await Option.find({ debateId: debate._id })
        .sort({ votes: -1 })
        .limit(3)
        .lean();
      return { ...debate, options: topOptions, _id: debate._id.toString() }; 
    })
  );

  return debatesWithOptions;
}

export const metadata = {
  title: 'All Debates - Letsettle',
  description: 'Browse all active debates sorted by popularity',
};

export default async function AllDebatesPage() {
  const debates = await getAllDebates();

  return (
    <div className="pb-20" style={{ paddingTop: 'var(--space-3xl)' }}>
      {/* Header */}
      <section 
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
            Browse all active debates sorted by popularity
          </p>
        </div>
      </section>

      {/* All Debates Grid */}
      <section 
        className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6"
        style={{ paddingTop: 'var(--space-3xl)' }}
      >
        <div className="flex items-center mb-8">
          <div>
            <h2 
              className="font-bold mb-2 text-base sm:text-xl"
              style={{ 
                color: 'var(--color-text-primary)',
             
              }}
            >
              {debates.length} Active Debates
            </h2>
            <div 
              style={{ 
                width: '60px',
                height: '2px',
                backgroundColor: 'var(--color-accent)'
              }}
            />
          </div>
          <Link 
            href="/" 
            className="hidden sm:block ml-auto text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ← Back to Home
          </Link>
            <Link 
            href="/" 
            className="sm:hidden ml-auto text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ← Back
          </Link>
        </div>

        {debates.length === 0 ? (
          <div 
            className="text-center py-20"
            style={{
              border: '1px dashed var(--color-base-border)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <h3 
              className="font-medium mb-2"
              style={{ 
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-lg)'
              }}
            >
              No debates yet
            </h3>
            <p 
              className="mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Be the first to start one.
            </p>
            <Link 
              href="/create" 
              className="font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-accent)' }}
            >
              Create a Debate →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {debates.map((debate: any) => (
              <DebateCard key={debate._id} debate={debate} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
