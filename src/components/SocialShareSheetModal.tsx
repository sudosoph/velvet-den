import React, { useState } from 'react';
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
    { id: 'whatsapp', label: 'WhatsApp', icon: '🟢', bg: '#25D366', fg: '#1E1022' },
    { id: 'instagram', label: 'Instagram', icon: '📸', bg: '#E1306C', fg: '#FFFFFF' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', bg: '#1E1022', fg: '#FFFFFF' },
    { id: 'discord', label: 'Discord', icon: '👾', bg: '#5865F2', fg: '#FFFFFF' },
    { id: 'x', label: 'X', icon: '𝕏', bg: '#0F172A', fg: '#FFFFFF' },
    { id: 'threads', label: 'Threads', icon: '🧵', bg: '#27272A', fg: '#FFFFFF' },
    { id: 'telegram', label: 'Telegram', icon: '✈️', bg: '#0EA5E9', fg: '#FFFFFF' },
    { id: 'copy_link', label: 'Copy Link', icon: '🔗', bg: '#FFBE0B', fg: '#1E1022' },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-[#1E1022]/65 p-3 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={payload.title}
    >
      <div className="vice-panel w-full max-w-lg rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3 border-b-2 border-[#1E1022]/10 pb-3">
          <div className="min-w-0">
            <span className="inline-block rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-[#1E1022]">
              Send to Group Chat or Bestie
            </span>
            <h3 className="mt-1 font-display text-xl text-[#1E1022] truncate">{payload.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share sheet"
            className="pop-btn rounded-xl bg-[#FFF4F7] p-2 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] p-3 text-xs font-semibold text-[#1E1022] space-y-1">
          <p className="line-clamp-3 leading-relaxed">{payload.message}</p>
          <p className="truncate font-mono text-[11px] font-bold text-[#D90452]">{payload.url}</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3">
          {channels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleChannel(ch.id)}
              aria-label={ch.label}
              className="pop-btn flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-2.5 text-center hover:bg-[#FFF4F7] cursor-pointer"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1E1022] text-base font-extrabold"
                style={{ backgroundColor: ch.bg, color: ch.fg }}
              >
                {ch.icon}
              </span>
              <span className="text-[11px] font-extrabold text-[#1E1022] leading-tight">
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
              className="pop-btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF2E63] px-3 py-2.5 text-xs font-extrabold text-white cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Save 9:16 Story PNG</span>
            </button>
          )}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              type="button"
              onClick={() => handleChannel('native')}
              className="pop-btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>More Apps</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleChannel('copy_link')}
            className="pop-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFFBEB] px-3 py-2.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Quick Copy</span>
          </button>
        </div>

        {statusBanner && (
          <div className="flex items-center gap-1.5 rounded-xl border-2 border-[#1E1022] bg-[#D1FAE5] px-3 py-2 text-xs font-extrabold text-[#065F46]">
            <Check className="h-4 w-4 shrink-0" />
            <span>{statusBanner}</span>
          </div>
        )}
      </div>
    </div>
  );
};
