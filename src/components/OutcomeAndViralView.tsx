import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, RotateCcw, Send, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import type { GameRunState, RunSummary } from '../domain/gameEngine';
import {
  buildEmojiReceipt,
  drawStoryReceiptToCanvas,
  encodeChallengeLink,
  shareOrCopy,
} from '../lib/viral';

interface OutcomeAndViralViewProps {
  run: GameRunState;
  summary: RunSummary;
  onClaimShareBonus: () => boolean;
  onPlayAgain: () => void;
  onOpenBoutique: () => void;
}

export const OutcomeAndViralView: React.FC<OutcomeAndViralViewProps> = ({
  run,
  summary,
  onClaimShareBonus,
  onPlayAgain,
  onOpenBoutique,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [senderName, setSenderName] = useState(
    run.pairing.role === 'her' ? run.pairing.her.name : run.pairing.his.name,
  );
  const [copiedState, setCopiedState] = useState<'receipt' | 'audition' | null>(null);
  const [bonusToast, setBonusToast] = useState(false);

  const baseUrl =
    typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? `${window.location.origin}${window.location.pathname}`
      : BRAND_CONFIG.publicBaseUrl;

  useEffect(() => {
    if (canvasRef.current) {
      drawStoryReceiptToCanvas(canvasRef.current, summary, BRAND_CONFIG.publicBaseUrl);
    }
  }, [summary]);

  const handleCopyEmojiReceipt = async () => {
    const text = buildEmojiReceipt(summary, baseUrl);
    await shareOrCopy({
      title: 'My Cougar Den Vetting Receipt',
      text,
      url: baseUrl,
    });
    setCopiedState('receipt');
    if (onClaimShareBonus()) setBonusToast(true);
    setTimeout(() => setCopiedState(null), 2800);
  };

  const handleSendPartnerAudition = async () => {
    const sliceHistory = run.history.slice(0, 5);
    const episodeIds =
      sliceHistory.length > 0
        ? sliceHistory.map((h) => h.episodeId)
        : ['check-drop', 'waiter-son-incident', 'code-switch-texting', 'trail-run-short-leash', 'mirror-game-insecurities'];
    const preferredChoiceIndices =
      sliceHistory.length > 0 ? sliceHistory.map((h) => h.choiceIndex) : [0, 0, 0, 0, 0];

    const link = encodeChallengeLink(
      {
        v: 1,
        senderName: senderName.trim() || 'Your Favorite Cougar',
        senderRole: run.pairing.role,
        herId: run.pairing.her.id,
        hisId: run.pairing.his.id,
        episodeIds,
        preferredChoiceIndices,
      },
      baseUrl,
    );

    await shareOrCopy({
      title: 'Pass My 60-Second Cougar/Cub Vetting Audition',
      text: `Think you’d survive dating me? Pass my 60-second Cougar Den Vetting Audition 👀`,
      url: link,
    });
    setCopiedState('audition');
    if (onClaimShareBonus()) setBonusToast(true);
    setTimeout(() => setCopiedState(null), 2800);
  };

  const handleDownloadStoryPng = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'cougar-den-vibe-receipt.png';
    a.click();
    if (onClaimShareBonus()) setBonusToast(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {bonusToast && (
        <div className="vice-panel rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-extrabold text-slate-950">
          🎉 +3 Bonus Den Credits unlocked for sharing! Use them on any VIP Deep-Cut episode.
        </div>
      )}

      {/* Main Verdict Card */}
      <section className="vice-panel rounded-3xl bg-gradient-to-br from-[#2b0f3a] via-[#190c29] to-[#0b2a30] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="rounded-md bg-amber-400 px-2.5 py-1 text-xs font-extrabold uppercase text-slate-950">
              Official Cougar Den Verdict
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl text-white leading-none">
              {summary.rankTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-xl">
              {summary.verdictLine}
            </p>

            {summary.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {summary.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-amber-400/50 bg-black/50 px-3 py-1 text-xs font-bold text-amber-300"
                  >
                    🏆 {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="vice-panel shrink-0 rounded-2xl bg-black/70 px-6 py-5 text-center">
            <div className="font-display text-6xl text-teal-300">{summary.overallScore}%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Vibe &amp; Maturity Score
            </div>
          </div>
        </div>
      </section>

      {/* 3-Part Viral Sharing Hub */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Loop 1: Send 2-Player Audition to Your Real Cougar/Cub */}
        <div className="vice-panel rounded-2xl bg-[#180d28] p-5 space-y-4">
          <span className="inline-flex items-center gap-1 rounded bg-teal-400/20 px-2.5 py-0.5 text-xs font-extrabold uppercase text-teal-300">
            <Sparkles className="h-3.5 w-3.5" /> Viral Couples &amp; Crush Engine (+3 Free Credits)
          </span>
          <h3 className="font-display text-3xl text-white">
            Send a 60-Second Vetting Audition to Your Cougar, Cub, or Hinge Match
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your exact choices are encoded right inside a private link. When they open it, they take your 5-scene audition and get roasted or certified against your dealbreakers!
          </p>

          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1" htmlFor="sender-nick">
              Your Name or Nickname on Their Screen:
            </label>
            <input
              id="sender-nick"
              type="text"
              maxLength={32}
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full rounded-xl border-2 border-black bg-black/60 px-3.5 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSendPartnerAudition}
            className="w-full vice-panel flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 py-3 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
          >
            {copiedState === 'audition' ? (
              <>
                <Check className="h-5 w-5" />
                <span>Audition Link Copied — Text It Now!</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Share / Copy 2-Player Audition Link</span>
              </>
            )}
          </button>

          {/* Loop 3A: Wordle-Style Emoji Receipt */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-xs font-bold text-pink-300">
              iMessage / Discord / Off-Topic Monday Emoji Receipt:
            </div>
            <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/60 p-3 text-[11px] text-slate-200 font-mono">
              {buildEmojiReceipt(summary, baseUrl)}
            </pre>
            <button
              type="button"
              onClick={handleCopyEmojiReceipt}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-rose-500 py-2.5 text-xs font-extrabold text-white hover:bg-rose-400 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>
                {copiedState === 'receipt'
                  ? 'Copied Receipt to Clipboard!'
                  : 'Copy Emoji Receipt (+3 Bonus Credits)'}
              </span>
            </button>
          </div>
        </div>

        {/* Loop 3B: 9:16 Story PNG Canvas Preview */}
        <div className="vice-panel rounded-2xl bg-[#101c28] p-5 flex flex-col items-center justify-between gap-4">
          <div className="w-full flex items-center justify-between">
            <h3 className="font-display text-2xl text-amber-300">
              9:16 IG Story / TikTok Receipt Card
            </h3>
            <button
              type="button"
              onClick={handleDownloadStoryPng}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-amber-400 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 shadow-[2px_2px_0px_#09050f] hover:bg-amber-300 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PNG</span>
            </button>
          </div>

          <canvas
            ref={canvasRef}
            className="w-56 sm:w-64 rounded-xl border-2 border-black shadow-lg"
          />

          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-slate-800 py-2.5 text-xs font-extrabold text-white hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Mix Another Pairing</span>
            </button>
            <button
              type="button"
              onClick={onOpenBoutique}
              className="flex-1 rounded-xl border-2 border-black bg-pink-600 py-2.5 text-xs font-extrabold text-white hover:bg-pink-500 cursor-pointer"
            >
              Unlock VIP Deep-Cuts &amp; Shop
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
