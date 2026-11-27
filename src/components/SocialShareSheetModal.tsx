import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Download, Share2, X } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export type ShareSurface =
  | 'audition'
  | 'bestie_profile'
  | 'pop_quiz'
  | 'checklist_25pt'
  | 'guide'
  | 'verdict_receipt';

export interface ShareSheetPayload {
  title: string;
  message: string;
  url: string;
  shareSurface: ShareSurface;
  discordMarkdown?: string;
  onDownloadStoryPng?: () => void;
}

interface SocialShareSheetModalProps {
  payload: ShareSheetPayload | null;
  onClose: () => void;
}

type ShareChannelId =
  | 'imessage'
  | 'whatsapp'
  | 'instagram'
  | 'tiktok'
  | 'discord'
  | 'x'
  | 'threads'
  | 'telegram'
  | 'copy_link'
  | 'native';

async function copyTextSafe(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore restricted clipboard permission in iframe/test
    }
  }
}

function openExternalPopup(href: string): void {
  if (typeof window !== 'undefined' && typeof window.open === 'function') {
    window.open(href, '_blank', 'noopener,noreferrer');
  }
}

export const SocialShareSheetModal: React.FC<SocialShareSheetModalProps> = ({
  payload,
  onClose,
}) => {
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!payload) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [payload, onClose]);

  if (!payload) return null;

  const fullText = payload.message.includes(payload.url)
    ? payload.message
    : `${payload.message}\n${payload.url}`;

  const handleChannel = async (channel: ShareChannelId) => {
    trackEvent('share_triggered', {
      channel,
      share_surface: payload.shareSurface,
      url: payload.url,
    });

    if (channel === 'imessage') {
      await copyTextSafe(fullText);
      if (typeof window !== 'undefined') {
        window.open(`sms:?&body=${encodeURIComponent(fullText)}`, '_self');
      }
      setStatusBanner('Opened Messages & copied link to clipboard!');
      return;
    }

    if (channel === 'whatsapp') {
      openExternalPopup(`https://wa.me/?text=${encodeURIComponent(fullText)}`);
      setStatusBanner('Opened WhatsApp share!');
      return;
    }

    if (channel === 'instagram') {
      await copyTextSafe(fullText);
      payload.onDownloadStoryPng?.();
      openExternalPopup('https://www.instagram.com/direct/inbox/');
      setStatusBanner(
        payload.onDownloadStoryPng
          ? 'Saved 9:16 Story PNG & copied link for Instagram DM!'
          : 'Copied link! Paste directly into Instagram DM or Story sticker.',
      );
      return;
    }

    if (channel === 'tiktok') {
      await copyTextSafe(fullText);
      openExternalPopup('https://www.tiktok.com/messages');
      setStatusBanner('Copied link! Paste into TikTok DMs or your bio.');
      return;
    }

    if (channel === 'discord') {
      await copyTextSafe(payload.discordMarkdown || fullText);
      setStatusBanner('Copied formatted Discord card! Paste in any channel or DM.');
      return;
    }

    if (channel === 'x') {
      openExternalPopup(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.message)}&url=${encodeURIComponent(payload.url)}`,
      );
      setStatusBanner('Opened X composer!');
      return;
    }

    if (channel === 'threads') {
      openExternalPopup(`https://www.threads.net/intent/post?text=${encodeURIComponent(fullText)}`);
      setStatusBanner('Opened Threads composer!');
      return;
    }

    if (channel === 'telegram') {
      openExternalPopup(
        `https://t.me/share/url?url=${encodeURIComponent(payload.url)}&text=${encodeURIComponent(payload.message)}`,
      );
      setStatusBanner('Opened Telegram share!');
      return;
    }

    if (channel === 'native' && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.message,
          url: payload.url,
        });
        setStatusBanner('Shared!');
        return;
      } catch {
        // Fall through to clipboard
      }
    }

    await copyTextSafe(fullText);
    setStatusBanner('Copied link & preview to clipboard!');
  };

  const channels: {
    id: ShareChannelId;
    label: string;
    icon: string;
    bg: string;
    fg: string;
  }[] = [
    { id: 'imessage', label: 'iMessage / SMS', icon: '💬', bg: '#10B981', fg: '#FFFFFF' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '🟢', bg: '#25D366', fg: '#09090B' },
    { id: 'instagram', label: 'Instagram', icon: '📸', bg: '#E1306C', fg: '#FFFFFF' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', bg: '#09090B', fg: '#FFFFFF' },
    { id: 'discord', label: 'Discord', icon: '👾', bg: '#5865F2', fg: '#FFFFFF' },
    { id: 'x', label: 'X', icon: '𝕏', bg: '#0F172A', fg: '#FFFFFF' },
    { id: 'threads', label: 'Threads', icon: '🧵', bg: '#27272A', fg: '#FFFFFF' },
    { id: 'telegram', label: 'Telegram', icon: '✈️', bg: '#0EA5E9', fg: '#FFFFFF' },
    { id: 'copy_link', label: 'Copy Link', icon: '🔗', bg: '#FFBE0B', fg: '#09090B' },
  ];

  const modalNode = (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-zinc-950/60 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={payload.title}
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-5 py-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Send to Group Chat or Bestie
            </div>
            <h3 className="mt-0.5 text-lg font-semibold text-zinc-950 leading-snug">{payload.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share sheet"
            className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-sm font-medium text-zinc-800 space-y-1.5">
            <p className="whitespace-pre-line leading-relaxed">{payload.message}</p>
            <p className="break-all font-mono text-xs font-semibold text-rose-600">{payload.url}</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3">
            {channels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleChannel(ch.id)}
                aria-label={ch.label}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-2.5 text-center hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold shadow-2xs"
                  style={{ backgroundColor: ch.bg, color: ch.fg }}
                >
                  {ch.icon}
                </span>
                <span className="text-xs font-semibold text-zinc-800 leading-tight">
                  {ch.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {payload.onDownloadStoryPng && (
              <button
                type="button"
                onClick={() => {
                  trackEvent('share_triggered', {
                    channel: 'instagram_story_png',
                    share_surface: payload.shareSurface,
                    url: payload.url,
                  });
                  payload.onDownloadStoryPng?.();
                  setStatusBanner('Downloaded 9:16 Story Card PNG!');
                }}
                className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Save 9:16 Story PNG</span>
              </button>
            )}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                type="button"
                onClick={() => handleChannel('native')}
                className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 py-2 text-sm font-semibold text-zinc-900 transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>More Apps</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleChannel('copy_link')}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              <span>Quick Copy</span>
            </button>
          </div>

          {statusBanner && (
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-900">
              <Check className="h-4 w-4 shrink-0" />
              <span>{statusBanner}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
