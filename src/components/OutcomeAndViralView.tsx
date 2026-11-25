import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Check,
  Copy,
  Download,
  Hash,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import type { GameRunState, RunSummary } from '../domain/gameEngine';
import {
  buildDiscordReceipt,
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
  const [sharePreviewTab, setSharePreviewTab] = useState<'imessage' | 'discord'>('imessage');
  const [copiedState, setCopiedState] = useState<'imessage' | 'discord' | 'audition' | null>(null);
  const [bonusToast, setBonusToast] = useState(false);

  const baseUrl =
    typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? `${window.location.origin}${window.location.pathname}`
      : BRAND_CONFIG.publicBaseUrl;

  const cleanHost = baseUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');

  useEffect(() => {
    if (canvasRef.current) {
      drawStoryReceiptToCanvas(canvasRef.current, summary, BRAND_CONFIG.publicBaseUrl);
    }
  }, [summary]);

  const handleCopyPlatformReceipt = async (platform: 'imessage' | 'discord') => {
    const text =
      platform === 'discord'
        ? buildDiscordReceipt(summary, baseUrl)
        : buildEmojiReceipt(summary, baseUrl);
    await shareOrCopy({
      title: 'My Cougars & Cubs Club Vibe Receipt',
      text,
      url: baseUrl,
    });
    setCopiedState(platform);
    if (onClaimShareBonus()) setBonusToast(true);
    setTimeout(() => setCopiedState(null), 2800);
  };

  const handleSendPartnerAudition = async () => {
    const sliceHistory = run.history.slice(0, 5);
    const episodeIds =
      sliceHistory.length > 0
        ? sliceHistory.map((h) => h.episodeId)
        : [
            'check-drop',
            'waiter-son-incident',
            'code-switch-texting',
            'trail-run-short-leash',
            'mirror-game-insecurities',
          ];
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
      title: 'Pass My 60-Second Cougars & Cubs Club Audition',
      text: `Think you’d survive dating me? Pass my 60-second Cougars & Cubs Club Vetting Audition 👀`,
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
    a.download = 'cougars-and-cubs-club-receipt.png';
    a.click();
    if (onClaimShareBonus()) setBonusToast(true);
  };

  const statPills: [string, number, string][] = [
    ['Maturity', summary.stats.maturity, 'text-rose-300'],
    ['Chivalry', summary.stats.chivalry, 'text-amber-300'],
    ['EQ', summary.stats.eq, 'text-emerald-300'],
    ['Chemistry', summary.stats.chemistry, 'text-pink-300'],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-stage-in">
      {bonusToast && (
        <div className="vice-panel rounded-2xl border-emerald-400/40 bg-emerald-500/15 px-5 py-3.5 text-sm font-semibold text-emerald-200">
          🎉 +3 Bonus Club Credits added to your wallet for sharing!
        </div>
      )}

      {/* Hero Verdict Banner */}
      <section className="vice-panel rounded-3xl bg-gradient-to-br from-[#231233] via-[#160e26] to-[#120b1d] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/35 bg-amber-400/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              Official Cougars &amp; Cubs Club Verdict
            </span>

            <h2 className="font-display text-3xl sm:text-5xl text-white">
              {summary.rankTitle}
            </h2>

            <p className="text-base text-slate-200 max-w-2xl leading-relaxed">
              {summary.verdictLine}
            </p>

            {summary.badges.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-2">
                {summary.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-amber-300/30 bg-white/5 px-3.5 py-1 text-xs font-semibold text-amber-200"
                  >
                    🏆 {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 rounded-3xl border border-amber-300/30 bg-black/45 px-7 py-6 text-center shadow-inner">
            <div className="font-display text-5xl sm:text-6xl text-amber-300">
              {summary.overallScore}%
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
              Vibe &amp; Chemistry Score
            </div>
            <div className="mt-2 text-xs font-medium text-emerald-300">
              Red Flags: {summary.redFlags} / 3
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Viral Studio: Left = 2P Audition + iMessage/Discord Interactive Cards; Right = Crisp 9:16 Story Card */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
        <div className="space-y-6">
          {/* Card 1: 2-Player Crush / Partner Vetting Link */}
          <div className="vice-panel rounded-3xl bg-[#161026]/90 p-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> 2-Player Couples &amp; Crush Mode (+3 Credits)
            </span>

            <h3 className="font-display text-2xl sm:text-3xl text-white">
              Send a 60-Second Vetting Audition to Your Cougar, Cub, or Match
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Your exact scene choices are encoded into a private challenge link. When they open it, they play 5 rapid scenes and see their live compatibility score against your standards.
            </p>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-amber-200" htmlFor="sender-nick">
                Your Name or Nickname on Their Screen
              </label>
              <input
                id="sender-nick"
                type="text"
                maxLength={32}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSendPartnerAudition}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 px-5 py-3.5 font-display text-lg text-slate-950 shadow-lg hover:brightness-105 active:scale-[0.99] transition cursor-pointer"
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
          </div>

          {/* Card 2: Sleek Interactive iMessage & Discord Share Studio */}
          <div className="vice-panel rounded-3xl bg-[#161026]/90 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-white">
                  Share Receipt to iMessage or Discord
                </h3>
                <p className="text-sm text-slate-300">
                  Preview how your card looks in group chats &amp; servers (+3 Bonus Credits)
                </p>
              </div>

              {/* Segmented Platform Switcher */}
              <div className="inline-flex rounded-2xl border border-white/12 bg-black/50 p-1 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setSharePreviewTab('imessage')}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
                    sharePreviewTab === 'imessage'
                      ? 'bg-[#0A84FF] text-white shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>iMessage</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSharePreviewTab('discord')}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
                    sharePreviewTab === 'discord'
                      ? 'bg-[#5865F2] text-white shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Hash className="h-4 w-4" />
                  <span>Discord</span>
                </button>
              </div>
            </div>

            {sharePreviewTab === 'imessage' ? (
              /* Authentic iOS Dark-Mode iMessage Bubble + Rich Link Card Preview */
              <div className="rounded-3xl border border-white/10 bg-[#000000] p-4 sm:p-5 space-y-3">
                <div className="text-center text-xs font-medium text-slate-400">
                  iMessage • Today
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {/* Blue iMessage Text Bubble */}
                  <div className="max-w-[92%] rounded-3xl rounded-br-md bg-[#0A84FF] px-4 py-3 text-sm sm:text-[15px] leading-relaxed text-white shadow-md space-y-1.5">
                    <div className="font-bold">
                      🐆 Cougars &amp; Cubs Club • {summary.pairing.her.age}F {summary.pairing.her.name} ×{' '}
                      {summary.pairing.his.age}M {summary.pairing.his.name}
                    </div>
                    {summary.episodeHighlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="text-white/95">
                        {h.emoji} {h.title}
                      </div>
                    ))}
                    <div className="font-semibold pt-0.5">
                      🏆 {summary.rankTitle} ({summary.overallScore}%)
                    </div>
                  </div>

                  {/* iOS Rich URL Preview Card */}
                  <div className="w-full max-w-[86%] overflow-hidden rounded-2xl border border-white/15 bg-[#1c1c1e]">
                    <div className="flex items-center gap-3 p-3">
                      <img
                        src={summary.pairing.her.photoUrl}
                        alt={summary.pairing.her.name}
                        className="h-12 w-12 rounded-xl object-cover object-top shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          Pass My 60-Second Cougars &amp; Cubs Vetting Test
                        </div>
                        <div className="truncate text-xs text-slate-400">{cleanHost}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex justify-end text-xs text-slate-400">Delivered</div>
              </div>
            ) : (
              /* Authentic Discord Rich Embed Preview */
              <div className="rounded-3xl border border-white/10 bg-[#313338] p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-400 text-sm">
                    🐆
                  </span>
                  <span className="text-sm font-bold text-white">You</span>
                  <span className="rounded bg-[#5865F2] px-1.5 py-0.5 text-xs font-semibold text-white">
                    CLUB
                  </span>
                  <span className="text-xs text-slate-400">Today at 8:42 PM</span>
                </div>

                <div className="rounded-xl border-l-4 border-rose-400 bg-[#2b2d31] p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Cougars &amp; Cubs Club • Official Vibe Receipt
                      </div>
                      <div className="mt-1 text-base font-bold text-white">
                        {summary.pairing.her.name} ({summary.pairing.her.age}F) ×{' '}
                        {summary.pairing.his.name} ({summary.pairing.his.age}M)
                      </div>
                      <div className="text-sm text-rose-200">{summary.rankTitle}</div>
                    </div>
                    <div className="rounded-xl bg-black/35 px-3 py-1.5 text-right">
                      <div className="font-display text-2xl text-amber-300">
                        {summary.overallScore}%
                      </div>
                      <div className="text-xs text-slate-400">Match</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {statPills.map(([lbl, val, color]) => (
                      <div key={lbl} className="rounded-lg bg-[#1e1f22] px-2.5 py-1.5">
                        <div className="text-xs text-slate-400">{lbl}</div>
                        <div className={`text-sm font-bold ${color}`}>{val}/100</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-sm text-slate-200">
                    {summary.episodeHighlights.slice(0, 3).map((h, i) => (
                      <div key={i}>
                        {h.emoji} {h.title}
                      </div>
                    ))}
                  </div>

                  <div className="text-xs font-semibold text-[#00a8fc]">
                    🍸 Pass the 60-Second Vetting Test → {cleanHost}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleCopyPlatformReceipt(sharePreviewTab)}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition cursor-pointer ${
                sharePreviewTab === 'imessage'
                  ? 'bg-[#0A84FF] hover:brightness-110'
                  : 'bg-[#5865F2] hover:brightness-110'
              }`}
            >
              {copiedState === sharePreviewTab ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>
                    {sharePreviewTab === 'imessage'
                      ? 'Copied iMessage Receipt to Clipboard!'
                      : 'Copied Discord Formatted Card!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>
                    {sharePreviewTab === 'imessage'
                      ? 'Copy Emoji Receipt for iMessage / SMS (+3 Bonus Credits)'
                      : 'Copy Rich Discord Receipt (+3 Bonus Credits)'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Crisp, Overflow-Proof 9:16 IG Story / TikTok Card */}
        <div className="vice-panel rounded-3xl bg-[#161026]/90 p-6 flex flex-col items-center gap-5">
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl sm:text-2xl text-white">
                9:16 Story &amp; TikTok Card
              </h3>
              <p className="text-sm text-slate-300"> Crisp 1080×1920 HD • Ready to post</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadStoryPng}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 shadow hover:bg-amber-200 transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-black/60 p-2.5 shadow-2xl">
            <canvas
              ref={canvasRef}
              className="w-72 sm:w-80 aspect-[9/16] rounded-[1.5rem] block"
            />
          </div>

          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onPlayAgain}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Mix Another Pairing</span>
            </button>
            <button
              type="button"
              onClick={onOpenBoutique}
              className="rounded-2xl bg-rose-500 py-3 text-sm font-bold text-white hover:bg-rose-400 transition cursor-pointer"
            >
              VIP Lounge &amp; Boutique
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
