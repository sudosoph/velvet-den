import React, { useState } from 'react';
import { Hash, Plus, Video, Volume2, Wifi } from 'lucide-react';
import type { SwipeProfile } from '../data/appProfiles';
import type { Episode } from '../data/episodes';
import type { PairingAnalysis, PlayerRole } from '../domain/taxonomy';
import { sfx } from '../lib/sound';

export type ChatSkin = 'imessage' | 'discord';

const IMESSAGE_TAPBACKS = ['❤️', '😂', '‼️', '👍', '👎', '❓'] as const;

interface SwipeOpeningChatCardProps {
  profile: SwipeProfile;
  role: PlayerRole;
  isPlayingVoice: boolean;
  onToggleVoice: () => void;
}

export const SwipeOpeningChatCard: React.FC<SwipeOpeningChatCardProps> = ({
  profile,
  role,
  isPlayingVoice,
  onToggleVoice,
}) => {
  const [hearted, setHearted] = useState(false);

  React.useEffect(() => {
    setHearted(false);
  }, [profile.id]);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#FD267A]/20 bg-white shadow-[0_14px_34px_-12px_rgba(15,23,42,0.14)]">
      {/* Authentic Tinder In-App Match Header (Personal iMessage numbers must be earned first!) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] bg-gradient-to-r from-[#FFF5F8] to-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <img
            src={profile.photos[0].photoUrl}
            alt=""
            className="h-7 w-7 rounded-full object-cover object-top ring-2 ring-[#FD267A]"
          />
          <span className="text-xs font-extrabold tracking-tight text-[#18101E]">
            {role === 'her'
              ? '🔥 Tinder Match • Opening Line'
              : profile.initiatesFirst
                ? '🔥 Tinder Match • Bold First Move'
                : '🔥 Tinder Match • Your Move First'}
          </span>
        </div>

        <span className="rounded-full border border-[#007AFF]/20 bg-[#EFF6FF] px-2.5 py-0.5 text-[10px] font-bold text-[#007AFF]">
          🔒 Earn # to Move to iMessage
        </span>
      </div>

      <div className="p-4 space-y-3 bg-white font-sans text-[#18101E]">
        {role === 'him' && profile.initiatesFirst === false ? (
          <div className="rounded-2xl border border-[#FBCFE8] bg-[#FFF5F8] px-4 py-3 text-center text-xs font-semibold text-[#9D174D]">
            ✨ {profile.openingDm}
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2">
              <div className="rounded-3xl rounded-bl-md bg-[#F0F2F4] px-4 py-2.5 text-[15px] font-medium leading-snug text-[#18101E] max-w-[90%]">
                {profile.openingDm}
              </div>
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setHearted((v) => !v);
                }}
                title="Heart Tinder opener"
                className={`rounded-full border px-2 py-1 text-xs font-bold transition cursor-pointer ${
                  hearted
                    ? 'border-[#FD267A] bg-[#FFF0F5] text-[#FD267A]'
                    : 'border-slate-200 bg-white text-slate-400 hover:text-[#FD267A]'
                }`}
              >
                ❤️
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={onToggleVoice}
                className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-bold transition cursor-pointer ${
                  isPlayingVoice
                    ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white'
                    : 'border border-[#FBCFE8] bg-[#FFF5F8] text-[#BE185D] hover:bg-[#FCE7F3]'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span className="inline-flex items-center gap-0.5 h-3">
                  {[4, 9, 6, 11, 8, 12, 5, 10, 7, 4].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className={`w-0.5 rounded-full ${
                        isPlayingVoice ? 'bg-white animate-pulse' : 'bg-[#FD267A]'
                      }`}
                    />
                  ))}
                </span>
                <span>{isPlayingVoice ? 'Playing Voice Prompt…' : '🔊 Hear Voice Prompt'}</span>
              </button>

              <span className="text-[11px] font-semibold text-[#64748B]">
                Swipe right or open Live Chat to earn off-app digits
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface SceneChatMessage {
  id: string;
  sender: 'her' | 'him' | 'buddy1' | 'buddy2';
  authorLabel: string;
  roleColor?: string;
  badge?: string;
  text: string;
  timestamp: string;
}

interface SceneChatThreadSpec {
  defaultSkin: ChatSkin;
  channelTitle: string;
  channelTopic: string;
  messages: SceneChatMessage[];
}

export function buildEpisodeChatSpec(
  episode: Episode,
  pairing: PairingAnalysis,
): SceneChatThreadSpec | null {
  const id = episode.id;
  const herName = pairing.her.name;
  const hisName = pairing.his.name;
  const herAge = pairing.her.age;
  const hisAge = pairing.his.age;

  if (id === 'cub-friends-memes-roblox-shock') {
    return {
      defaultSkin: 'discord',
      channelTitle: '🎮-roblox-dti-and-boys-vc',
      channelTopic: 'Playing Roblox: Dress to Impress • 4 in Voice Channel',
      messages: [
        {
          id: 'm1',
          sender: 'buddy1',
          authorLabel: 'Kyle_DTI_RunwayKing',
          roleColor: '#57F287',
          badge: 'ROBLOX VIP',
          text: `BRO @${hisName} actually brought ${herName} to pre-game!! quick hide the empty White Claw pyramid 💀`,
          timestamp: 'Today at 9:58 PM',
        },
        {
          id: 'm2',
          sender: 'buddy2',
          authorLabel: 'BrodyLifts225',
          roleColor: '#FEE75C',
          badge: 'DTI JUDGE',
          text: `hold up let her judge my Dress to Impress Cyber-Y2K runway fit first 😭 is this 5 stars or am I cooked??`,
          timestamp: 'Today at 9:59 PM',
        },
        {
          id: 'm3',
          sender: 'him',
          authorLabel: hisName,
          roleColor: '#F0B232',
          badge: `${hisAge}M CUB`,
          text: `boys behave for 5 mins i swear 💀 ${herName} i brought real pinot noir in my jacket, say the word and we’re out 🍷`,
          timestamp: 'Today at 10:00 PM',
        },
      ],
    };
  }

  if (id === 'puma-boys-groupchat-kid' || id === 'cougar-boys-groupchat-ceo') {
    return {
      defaultSkin: 'discord',
      channelTitle: '💬-the-boys-group-chat',
      channelTopic: 'Pinned: Zero disrespect or you get kicked from fantasy football',
      messages: [
        {
          id: 'g1',
          sender: 'buddy1',
          authorLabel: 'Tyler_SnapStreak',
          roleColor: '#ED4245',
          badge: 'UNVETTED',
          text:
            id === 'puma-boys-groupchat-kid'
              ? `wait bro she’s ${herAge} AND has a kid?! are u bringing Capri Suns to Friday night now lmao 😂`
              : `yo she’s a ${herAge}yo executive?! ask her if she’s putting us all on payroll 💀💳`,
          timestamp: 'Today at 6:12 PM',
        },
        {
          id: 'g2',
          sender: 'buddy2',
          authorLabel: 'Marcus_OldSoul',
          roleColor: '#57F287',
          badge: 'GROWN MAN',
          text: `Tyler this is why you haven’t made it past Date #1 since 2023. Let ${hisName} cook.`,
          timestamp: 'Today at 6:13 PM',
        },
        {
          id: 'g3',
          sender: 'him',
          authorLabel: hisName,
          roleColor: '#F0B232',
          badge: 'TYPING REPLY…',
          text: `[Choose your move below to shut down the group chat cleanly]`,
          timestamp: 'Today at 6:14 PM',
        },
      ],
    };
  }

  if (id === 'pine-pollen-feels-incoherent-text-spiral') {
    return {
      defaultSkin: 'imessage',
      channelTitle: `${herName} & ${hisName}`,
      channelTopic: 'iMessage • 11:47 PM Expectations Collision',
      messages: [
        {
          id: 'pp1',
          sender: 'him',
          authorLabel: hisName,
          text: `brooo took 2 droppers of wild pine pollen under my tongue for testosterone pre legs and ngl my mind is racing rn`,
          timestamp: '11:44 PM',
        },
        {
          id: 'pp2',
          sender: 'him',
          authorLabel: hisName,
          text: `like im just really all up in my feels rn idk what were even doing here tbh u havent texted since 9pm are we on different pages or am i cooked 😭🌲`,
          timestamp: '11:46 PM',
        },
        {
          id: 'pp3',
          sender: 'him',
          authorLabel: hisName,
          text: `sorry ignore that pine pollen got my T crazy lol unless u wanna talk rn??`,
          timestamp: '11:47 PM',
        },
        {
          id: 'pp4',
          sender: 'her',
          authorLabel: herName,
          text:
            herAge >= 50
              ? `Good morning, ${hisName}. Two ground rules if we are going to see each other: I turn my phone off at 10:00 PM on weeknights, and you will need to retire the pine-pollen dropper before texting me again.`
              : herAge >= 40
                ? `Good morning, ${hisName} ☕ Two quick ground rules: quiet weeknights after 10:00 PM aren't ghosting, and please step away from the pine-pollen dropper and use full sentences.`
                : `Morning, ${hisName} ☕ Two quick rules: I'm asleep by 10:00 PM on weeknights so quiet evenings aren't ghosting, and please put the pine-pollen dropper down and text in normal sentences.`,
          timestamp: '8:15 AM',
        },
      ],
    };
  }

  if (
    id === 'code-switch-texting' ||
    episode.sceneArt === 'code_switch_phone' ||
    id === 'steamy-texts-sister-age-shock' ||
    id === 'jaguar-genx-phone-call' ||
    id === 'generational-1900s-venmo-whiplash' ||
    id === 'broke-college-dutch-calculator-horror'
  ) {
    const messages: SceneChatMessage[] =
      id === 'steamy-texts-sister-age-shock'
        ? [
            {
              id: 's1',
              sender: 'him',
              authorLabel: hisName,
              text: `Still thinking about last night… cleared my whole evening so I can cook for you at 8 🔥`,
              timestamp: '2:14 PM',
            },
            {
              id: 's2',
              sender: 'her',
              authorLabel: herName,
              text:
                herAge >= 45
                  ? `Hold everything. My youngest cousin just sent an invite for her ${hisAge}th birthday dinner. Were the two of you seriously both born in ${2026 - hisAge}?`
                  : `Wait a second. My younger sister just texted me her ${hisAge}th birthday invite. Were you two seriously both born in ${2026 - hisAge}?! 😳`,
              timestamp: '2:15 PM',
            },
          ]
        : id === 'jaguar-genx-phone-call'
          ? [
              {
                id: 'j1',
                sender: 'him',
                authorLabel: hisName,
                text: `hey wyd thinking abt u 👀`,
                timestamp: '11:12 AM',
              },
              {
                id: 'j2',
                sender: 'her',
                authorLabel: herName,
                text:
                  herAge >= 50
                    ? `I am ${herAge} and in meetings until five. Skip the all-day check-in texts and call me at 6:00 PM sharp.`
                    : `I’m ${herAge} and in back-to-back meetings today. Skip the midday check-in texts and call me at 6:00 PM sharp 🥂`,
                timestamp: '12:04 PM',
              },
            ]
          : id === 'broke-college-dutch-calculator-horror' ||
              id === 'generational-1900s-venmo-whiplash'
            ? [
                {
                  id: 'v1',
                  sender: 'him',
                  authorLabel: hisName,
                  text: `had sm fun!! just sent u a $41.63 Venmo request for ur half + 4/7ths of the edamame pods 🫛✨`,
                  timestamp: '10:42 PM',
                },
                {
                  id: 'v2',
                  sender: 'her',
                  authorLabel: herName,
                  text:
                    herAge >= 50
                      ? `Did you genuinely just send an itemized Venmo request for four-sevenths of an edamame appetizer? Delete my number immediately.`
                      : herAge >= 40
                        ? `Did you seriously just itemize four-sevenths of an edamame bowl in my messages? I’ll cover the full $41.63 as a parting gift. Take care.`
                        : `Did you seriously just itemize four-sevenths of an edamame bowl in my iMessages? Lose my number immediately 🚩`,
                  timestamp: '10:43 PM',
                },
              ]
            : [
                {
                  id: 'c1',
                  sender: 'him',
                  authorLabel: hisName,
                  text: `yo last night was crazy fr 💀 whats ur snap so we keep a streak going??`,
                  timestamp: '11:48 AM',
                },
                {
                  id: 'c2',
                  sender: 'her',
                  authorLabel: herName,
                  text:
                    herAge >= 50
                      ? `I own property and drink Barolo, ${hisName}. Ask me for a Snapchat streak again and this conversation is over.`
                      : herAge >= 40
                        ? `I own real estate and drink Barolo, ${hisName}. I haven’t opened Snapchat in a decade. Text me a real Friday plan instead 🍷`
                        : `I have a mortgage and a Barolo habit, ${hisName}. Retire the Snapchat streak request and send a real Friday plan instead 🍷`,
                  timestamp: '11:50 AM',
                },
              ];

    return {
      defaultSkin: 'imessage',
      channelTitle: `${herName} & ${hisName}`,
      channelTopic: 'iMessage • Live Text Thread',
      messages,
    };
  }

  return null;
}

export const EpisodeChatFeed: React.FC<{
  spec: SceneChatThreadSpec;
  pairing: PairingAnalysis;
}> = ({ spec, pairing }) => {
  const skin = spec.defaultSkin;
  const [tapbacks, setTapbacks] = useState<Record<string, string>>({});
  const [discordReacts, setDiscordReacts] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setTapbacks({});
    setDiscordReacts({});
  }, [spec]);

  const cycleTapback = (msgId: string) => {
    sfx.messagePop();
    setTapbacks((prev) => {
      const curr = prev[msgId];
      const nextIdx = curr
        ? (IMESSAGE_TAPBACKS.indexOf(curr as (typeof IMESSAGE_TAPBACKS)[number]) + 1) %
          (IMESSAGE_TAPBACKS.length + 1)
        : 0;
      if (nextIdx >= IMESSAGE_TAPBACKS.length) {
        const copy = { ...prev };
        delete copy[msgId];
        return copy;
      }
      return { ...prev, [msgId]: IMESSAGE_TAPBACKS[nextIdx] };
    });
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 shadow-[0_16px_38px_-12px_rgba(15,23,42,0.2)]">
      {/* Authentic Single-Medium App Window Bar (iMessage for personal texts, Discord for group server) */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 ${
          skin === 'imessage'
            ? 'border-[#D1D1D6] bg-[#F5F5F7] text-[#1C1C1E]'
            : 'border-[#1F2023] bg-[#1E1F22] text-[#DBDEE1]'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </div>
          <span className="text-xs font-bold tracking-tight">
            {skin === 'imessage'
              ? 'Messages • Tap any bubble to send a Tapback'
              : `Discord • #${spec.channelTitle}`}
          </span>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            skin === 'imessage'
              ? 'bg-[#007AFF]/12 text-[#007AFF]'
              : 'bg-[#5865F2]/25 text-[#DEE0FC]'
          }`}
        >
          {skin === 'imessage' ? '💬 Off-App iMessage' : '🎮 Group Server'}
        </span>
      </div>

      {skin === 'imessage' ? (
        <div className="bg-white font-sans text-[#1C1C1E]">
          {/* iOS Status & Header */}
          <div className="flex items-center justify-between border-b border-[#C6C6C8] bg-[#F2F2F7] px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#007AFF]">
              <span>9:41</span>
              <span>‹ Messages</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={
                  pairing.role === 'her' ? pairing.his.photoUrl : pairing.her.photoUrl
                }
                alt=""
                className="h-7 w-7 rounded-full object-cover object-top"
              />
              <span className="text-xs font-bold text-[#1C1C1E]">
                {pairing.role === 'her' ? pairing.his.name : pairing.her.name} ›
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#007AFF]">
              <Wifi className="h-3.5 w-3.5 text-[#1C1C1E]" />
              <Video className="h-4 w-4" />
            </div>
          </div>

          <div className="p-4 space-y-3 bg-white">
            <div className="text-center text-[11px] font-medium text-[#8E8E93]">
              {spec.channelTopic}
            </div>

            {spec.messages.map((m) => {
              const isOutgoing =
                (pairing.role === 'her' && m.sender === 'her') ||
                (pairing.role === 'him' && m.sender === 'him');
              const reaction = tapbacks[m.id];

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}
                >
                  {!isOutgoing && (
                    <span className="ml-2 mb-0.5 text-[11px] font-medium text-[#8E8E93]">
                      {m.authorLabel} • {m.timestamp}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => cycleTapback(m.id)}
                    title="Tap to add iOS Tapback reaction"
                    className={`relative max-w-[85%] px-4 py-2.5 text-left text-[15px] leading-snug transition active:scale-[0.99] cursor-pointer ${
                      isOutgoing
                        ? 'rounded-[20px] rounded-br-[4px] bg-[#007AFF] text-white'
                        : 'rounded-[20px] rounded-bl-[4px] bg-[#E9E9EB] text-[#1C1C1E]'
                    }`}
                  >
                    {reaction && (
                      <span
                        className={`absolute -top-2.5 ${
                          isOutgoing ? '-left-2' : '-right-2'
                        } inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#007AFF] px-1.5 text-xs text-white shadow`}
                      >
                        {reaction}
                      </span>
                    )}
                    {m.text}
                  </button>
                  {isOutgoing && (
                    <span className="mr-1 mt-0.5 text-[10px] font-medium text-[#8E8E93]">
                      Delivered • Tap bubble for Tapback
                    </span>
                  )}
                </div>
              );
            })}

            {/* Decorative iOS Composer Preview */}
            <div className="pt-1 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E9E9EB] text-[#8E8E93]">
                <Plus className="h-4 w-4" />
              </span>
              <div className="flex-1 rounded-full border border-[#C6C6C8] bg-[#F2F2F7]/60 px-3.5 py-1.5 text-xs text-[#8E8E93]">
                Pick your reply card below to send iMessage…
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AUTHENTIC DISCORD CHANNEL THREAD */
        <div className="bg-[#313338] font-sans text-[#DBDEE1]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F2023] bg-[#2B2D31] px-4 py-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Hash className="h-4 w-4 text-[#80848E]" />
              <span>{spec.channelTitle}</span>
            </div>
            <span className="text-[11px] text-[#949BA4]">{spec.channelTopic}</span>
          </div>

          <div className="p-3.5 space-y-2.5">
            {spec.messages.map((m) => {
              const avatarUrl =
                m.sender === 'her'
                  ? pairing.her.photoUrl
                  : m.sender === 'him'
                    ? pairing.his.photoUrl
                    : undefined;
              return (
                <div
                  key={m.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-[#2E3035] transition"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={m.authorLabel}
                      className="h-9 w-9 rounded-full object-cover object-top shrink-0"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-xs font-bold text-white">
                      🎮
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className="text-sm font-bold"
                        style={{ color: m.roleColor || '#F47FFF' }}
                      >
                        {m.authorLabel}
                      </span>
                      {m.badge && (
                        <span className="rounded bg-[#5865F2]/25 px-1.5 py-0.2 text-[10px] font-bold text-[#949CF7]">
                          {m.badge}
                        </span>
                      )}
                      <span className="text-[11px] text-[#949BA4]">{m.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#DBDEE1]">{m.text}</p>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {(['💀', '🔥', '🚩', '🫡'] as const).map((emoji, idx) => {
                        const key = `${m.id}:${emoji}`;
                        const active = Boolean(discordReacts[key]);
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              sfx.messagePop();
                              setDiscordReacts((prev) => ({ ...prev, [key]: !prev[key] }));
                            }}
                            className={`inline-flex h-6 items-center gap-1 rounded border px-1.5 text-[11px] font-semibold cursor-pointer ${
                              active
                                ? 'border-[#5865F2] bg-[#5865F2]/25 text-[#DEE0FC]'
                                : 'border-[#3F4147] bg-[#2B2D31] text-[#B5BAC1] hover:border-[#80848E]'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{idx + 1 + (active ? 1 : 0)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
