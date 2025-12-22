'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFingerprint } from '@/lib/hooks/useFingerprint';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

interface VoteButtonProps {
  debateId: string;
  optionId: string;
  optionName: string;
  initialVotes: number;
  totalVotes: number;
  index?: number; // Optional index for numbering
}

export default function VoteButton({
  debateId,
  optionId,
  optionName,
  initialVotes,
  totalVotes,
  index,
}: VoteButtonProps) {
  const router = useRouter();
  const fingerprintId = useFingerprint();
  
  const [votes, setVotes] = useState(initialVotes);
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isThisOptionVoted, setIsThisOptionVoted] = useState(false);

  // Sync votes state when initialVotes prop changes (after router.refresh)
  useEffect(() => {
    setVotes(initialVotes);
  }, [initialVotes]);

  // Check localStorage on mount to see if user has voted for this debate
  useEffect(() => {
    const checkVoteStatus = () => {
      const votedOptionId = localStorage.getItem(`vote_${debateId}`);
      if (votedOptionId) {
        setHasVoted(true);
        if (votedOptionId === optionId) {
          setIsThisOptionVoted(true);
        } else {
          // This option is NOT the voted one, reset state
          setIsThisOptionVoted(false);
        }
      } else {
        setHasVoted(false);
        setIsThisOptionVoted(false);
      }
    };

    // Check on mount
    checkVoteStatus();

    // Listen for vote events from other VoteButton components
    const handleVoteEvent = (event: CustomEvent) => {
      if (event.detail.debateId === debateId) {
        checkVoteStatus();
      }
    };

    window.addEventListener('voteRecorded', handleVoteEvent as EventListener);

    return () => {
      window.removeEventListener('voteRecorded', handleVoteEvent as EventListener);
    };
  }, [debateId, optionId]);

  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If loading, don't allow action
    if (isLoading || !fingerprintId) return;
    
    // If already voted for THIS specific option, don't allow re-voting
    if (isThisOptionVoted) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debateId, optionId, fingerprintId }),
      });

      const data = await res.json();

      if (res.ok) {
        const isVoteChange = data.isChange;
        
        if (isVoteChange) {
          // Vote was changed from another option
          // Don't increment locally - let router.refresh() update from server
          toast.success("Vote changed successfully!");
        } else {
          // New vote - safe to increment locally
          if (data.message) {
            // Clicked same option - already voted
            return;
          }
          setVotes((prev) => prev + 1);
          toast.success("Vote recorded");
        }

        setHasVoted(true);
        setIsThisOptionVoted(true);
        
        // Store voted option in localStorage
        localStorage.setItem(`vote_${debateId}`, optionId);
        
        // Notify all other VoteButton components to update
        window.dispatchEvent(new CustomEvent('voteRecorded', { 
          detail: { debateId, optionId } 
        }));
        
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to record vote');
      }
    } catch (error) {
      console.error('Vote failed', error);
      toast.error('Failed to record vote');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isLoading || isThisOptionVoted}
      className={cn(
        "group relative flex items-center justify-between w-full p-4 transition-all",
        isThisOptionVoted 
          ? "cursor-default" 
          : hasVoted
          ? "cursor-pointer hover:opacity-70"
          : "cursor-pointer hover:opacity-70"
      )}
      style={{
        border: `1px solid ${isThisOptionVoted ? 'var(--color-accent)' : 'var(--color-base-border)'}`,
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-base-surface)',
        transition: 'all var(--transition-slow)'
      }}
    >
      {/* Progress Bar - Only Show After Voting */}
      {hasVoted && (
        <div 
          className="absolute left-0 top-0 bottom-0 transition-all"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: 'var(--color-accent)',
            opacity: 0.08,
            borderRadius: 'var(--radius-sm)',
            transitionDuration: 'var(--transition-slow)'
          }} 
        />
      )}

      <div className="flex items-center gap-3 relative z-10">
        {/* Option Number */}
        {index !== undefined && (
          <div 
            className="font-mono-numbers font-bold w-6 text-left"
            style={{ 
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--font-size-base)'
            }}
          >
            #{index + 1}
          </div>
        )}
        
        {/* Checkbox-style Indicator */}
        <div 
          className="flex items-center justify-center transition-all"
          style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${isThisOptionVoted ? 'var(--color-accent)' : 'var(--color-base-border)'}`,
            borderRadius: '2px',
            backgroundColor: isThisOptionVoted ? 'var(--color-accent)' : 'transparent',
            transition: 'all var(--transition-slow)'
          }}
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} />
          ) : isThisOptionVoted ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : null}
        </div>
        
        <span 
          className="font-medium text-left"
          style={{ 
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-base)'
          }}
        >
          {optionName}
        </span>
      </div>

      {/* Vote Count and Percentage - Only Show After Voting */}
      {hasVoted && (
        <div className="flex flex-col items-end relative z-10 gap-0.5">
          <span 
            className="font-mono-numbers font-medium"
            style={{ 
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-base)'
            }}
          >
            {votes}
          </span>
          <span 
            className="font-mono-numbers text-xs font-medium"
            style={{ color: isThisOptionVoted ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}
          >
            {percentage}%
          </span>
        </div>
      )}
    </button>
  );
}
