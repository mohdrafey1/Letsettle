'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

interface AddOptionFormProps {
  debateId: string;
  isMoreOptionAllowed?: boolean;
}

export default function AddOptionForm({ debateId, isMoreOptionAllowed = true }: AddOptionFormProps) {
  const router = useRouter();
  const [optionName, setOptionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isMoreOptionAllowed) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/option', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ debateId, name: optionName }),
      });

      if (res.ok) {
        setOptionName('');
        toast.success("Option added");
        router.refresh();
      } else {
        toast.error((await res.json()).error || "Failed to add option");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mt-8 p-6"
      style={{
        border: '1px solid var(--color-base-border)',
        borderRadius: 'var(--radius-sm)'
      }}
    >
      <h3 
        className="font-medium mb-4"
        style={{ 
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-size-base)'
        }}
      >
        Add your option
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <input
          type="text"
          placeholder="Suggest a new option..."
          className="flex-1 px-4 py-2 outline-none transition-all"
          style={{
            border: '1px solid var(--color-base-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-primary)'
          }}
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !optionName.trim()}
          className="px-6 py-2 font-medium transition-opacity disabled:opacity-40"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)'
          }}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}
