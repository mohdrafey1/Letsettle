'use client';

import { useState } from 'react';
import { Share2, Check, Twitter, Facebook, Linkedin, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/debate/${slug}` 
    : '';

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:opacity-70"
        style={{
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-base-surface)'
        }}
      >
        <Share2 size={16} />
        <span className="hidden sm:block">Share</span>
      </button>

      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Share Menu */}
          <div 
            className="absolute right-0 mt-2 w-64 p-4 shadow-lg z-50"
            style={{
              backgroundColor: 'var(--color-base-surface)',
              border: '1px solid var(--color-base-border)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-3 mb-3 transition-all hover:opacity-70"
              style={{
                border: '1px solid var(--color-base-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-accent-light)'
              }}
            >
              {copied ? (
                <Check size={20} style={{ color: 'var(--color-accent)' }} />
              ) : (
                <LinkIcon size={20} style={{ color: 'var(--color-accent)' }} />
              )}
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>

            {/* Social Media Buttons */}
            <div className="space-y-2">
              <p 
                className="text-xs font-medium mb-2"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Share on social media
              </p>
              
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 transition-all hover:opacity-70"
                style={{
                  border: '1px solid var(--color-base-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Twitter size={18} style={{ color: '#1DA1F2' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  Twitter
                </span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 transition-all hover:opacity-70"
                style={{
                  border: '1px solid var(--color-base-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Facebook size={18} style={{ color: '#4267B2' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  Facebook
                </span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 transition-all hover:opacity-70"
                style={{
                  border: '1px solid var(--color-base-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Linkedin size={18} style={{ color: '#0077B5' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  LinkedIn
                </span>
              </a>

              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 transition-all hover:opacity-70"
                style={{
                  border: '1px solid var(--color-base-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <MessageCircle size={18} style={{ color: '#25D366' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  WhatsApp
                </span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
