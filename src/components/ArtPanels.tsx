import React from 'react';
import type { AppPhotoVariant } from '../data/appProfiles';
import type { Episode } from '../data/episodes';

export const ArchetypePortraitSvg: React.FC<{
  variant:
    | 'puma'
    | 'princess'
    | 'cougar'
    | 'jaguar'
    | 'panther'
    | 'golden'
    | 'oldsoul'
    | 'trail'
    | 'architect';
  className?: string;
}> = ({ variant, className = 'w-20 h-20' }) => {
  const palette: Record<string, [string, string, string]> = {
    cougar: ['#f43f5e', '#f59e0b', '#fde68a'],
    princess: ['#ec4899', '#f472b6', '#fbcfe8'],
    puma: ['#fb7185', '#14b8a6', '#99f6e4'],
    jaguar: ['#d946ef', '#f59e0b', '#fef08a'],
    panther: ['#6366f1', '#2dd4bf', '#e2e8f0'],
    golden: ['#f59e0b', '#14b8a6', '#fde68a'],
    oldsoul: ['#0ea5e9', '#f43f5e', '#bae6fd'],
    trail: ['#10b981', '#f59e0b', '#a7f3d0'],
    architect: ['#8b5cf6', '#ec4899', '#ddd6fe'],
  };
  const [c1, c2, accent] = palette[variant] ?? palette.cougar;
  const isHer = ['puma', 'princess', 'cougar', 'jaguar', 'panther'].includes(variant);

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} rounded-xl border-2 border-black shadow-[4px_4px_0px_#09050f] shrink-0`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#grad-${variant})`} />
      {/* Vice pop-art diagonal comic stripe */}
      <polygon points="0,95 120,62 120,120 0,120" fill="#09050f" fillOpacity="0.45" />
      {/* Sunburst disc */}
      <circle cx="92" cy="28" r="16" fill={accent} fillOpacity="0.85" stroke="#09050f" strokeWidth="3" />
      {/* Stylized cel-shaded silhouette */}
      <path
        d={
          isHer
            ? 'M26 118 C28 84, 92 84, 94 118 Z'
            : 'M20 118 C24 82, 96 82, 100 118 Z'
        }
        fill="#13091f"
        stroke="#09050f"
        strokeWidth="3.5"
      />
      <circle cx="60" cy="54" r="21" fill="#fed7aa" stroke="#09050f" strokeWidth="3.5" />
      {isHer ? (
        <>
          <path
            d="M35 54 C34 26, 86 24, 86 56 C86 70, 92 78, 84 82 C78 68, 76 46, 60 42 C45 46, 42 68, 36 80 Z"
            fill={variant === 'panther' ? '#e2e8f0' : '#1e1b4b'}
            stroke="#09050f"
            strokeWidth="3"
          />
          {/* Chic sunglasses */}
          <rect x="44" y="47" width="14" height="9" rx="3" fill="#09050f" />
          <rect x="62" y="47" width="14" height="9" rx="3" fill="#09050f" />
          <line x1="58" y1="51" x2="62" y2="51" stroke="#f59e0b" strokeWidth="2.5" />
          {variant === 'princess' && (
            <polygon
              points="46,28 53,18 60,26 67,18 74,28"
              fill="#fde047"
              stroke="#09050f"
              strokeWidth="2.5"
            />
          )}
        </>
      ) : (
        <>
          <path
            d="M39 48 C40 28, 80 28, 81 48 C74 40, 46 40, 39 48 Z"
            fill="#1e293b"
            stroke="#09050f"
            strokeWidth="3"
          />
          <circle cx="52" cy="53" r="2.6" fill="#09050f" />
          <circle cx="68" cy="53" r="2.6" fill="#09050f" />
          <path d="M52 63 Q60 69 68 63" fill="none" stroke="#09050f" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export const AppPhotoIllustration: React.FC<{ variant: AppPhotoVariant }> = ({ variant }) => {
  if (variant === 'liquor_bottle_trap') {
    return (
      <svg viewBox="0 0 420 250" className="w-full h-56 object-cover rounded-xl border-3 border-black">
        <defs>
          <linearGradient id="ledTrap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="55%" stopColor="#be185d" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <rect width="420" height="250" fill="url(#ledTrap)" />
        {/* Purple LED ceiling strip */}
        <line x1="0" y1="18" x2="420" y2="18" stroke="#f0abfc" strokeWidth="8" />
        {/* Shirtless mirror torso */}
        <rect x="135" y="95" width="120" height="145" rx="22" fill="#fdba74" stroke="#09050f" strokeWidth="4" />
        <circle cx="195" cy="64" r="26" fill="#fdba74" stroke="#09050f" strokeWidth="4" />
        {/* Giant liquor handle bottle */}
        <g transform="translate(270, 58) rotate(11)">
          <rect x="16" y="0" width="20" height="28" fill="#dc2626" stroke="#09050f" strokeWidth="3" />
          <rect x="0" y="26" width="52" height="132" rx="10" fill="#e0f2fe" fillOpacity="0.92" stroke="#09050f" strokeWidth="4" />
          <rect x="5" y="64" width="42" height="52" fill="#fef3c7" stroke="#09050f" strokeWidth="2.5" />
          <text x="26" y="88" textAnchor="middle" fontSize="13" fontWeight="900" fill="#991b1b">
            TITO&apos;S
          </text>
          <text x="26" y="106" textAnchor="middle" fontSize="10" fontWeight="800" fill="#09050f">
            1.75L
          </text>
        </g>
        <rect x="16" y="196" width="235" height="38" rx="6" fill="#dc2626" stroke="#09050f" strokeWidth="3" />
        <text x="28" y="220" fontSize="15" fontWeight="800" fill="#ffffff">
          🚩 PHOTO #2 LIQUOR BOTTLE TRAP
        </text>
      </svg>
    );
  }

  if (variant === 'crew_socks_mirror') {
    return (
      <svg viewBox="0 0 420 250" className="w-full h-56 object-cover rounded-xl border-3 border-black">
        <rect width="420" height="250" fill="#1e293b" />
        {/* Bare floor mattress */}
        <rect x="28" y="160" width="190" height="58" rx="8" fill="#cbd5e1" stroke="#09050f" strokeWidth="3.5" />
        <text x="45" y="194" fontSize="13" fontWeight="800" fill="#334155">
          NO BEDFRAME DETECTED
        </text>
        {/* White crew socks + slides */}
        <rect x="268" y="128" width="28" height="72" fill="#ffffff" stroke="#09050f" strokeWidth="3.5" />
        <rect x="312" y="128" width="28" height="72" fill="#ffffff" stroke="#09050f" strokeWidth="3.5" />
        <rect x="260" y="196" width="44" height="18" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="3" />
        <rect x="306" y="196" width="44" height="18" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="3" />
        <rect x="16" y="18" width="265" height="36" rx="6" fill="#f43f5e" stroke="#09050f" strokeWidth="3" />
        <text x="28" y="42" fontSize="14" fontWeight="800" fill="#ffffff">
          🚩 CREW SOCKS + UNMADE FLOOR BED
        </text>
      </svg>
    );
  }

  if (variant === 'home_chef_linen') {
    return (
      <svg viewBox="0 0 420 250" className="w-full h-56 object-cover rounded-xl border-3 border-black">
        <defs>
          <linearGradient id="kitchenWarm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        <rect width="420" height="250" fill="url(#kitchenWarm)" />
        {/* Linen apron torso */}
        <rect x="145" y="78" width="130" height="150" rx="16" fill="#d6d3d1" stroke="#09050f" strokeWidth="4" />
        <line x1="158" y1="78" x2="258" y2="188" stroke="#78716c" strokeWidth="6" />
        <line x1="262" y1="78" x2="162" y2="188" stroke="#78716c" strokeWidth="6" />
        <circle cx="210" cy="46" r="24" fill="#fed7aa" stroke="#09050f" strokeWidth="4" />
        <rect x="16" y="196" width="275" height="38" rx="6" fill="#10b981" stroke="#09050f" strokeWidth="3" />
        <text x="28" y="220" fontSize="14" fontWeight="800" fill="#052e16">
          💚 WASHED LINEN APRON + CLEAN COUNTERS
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 420 250" className="w-full h-56 object-cover rounded-xl border-3 border-black">
      <defs>
        <linearGradient id="viceSunsetCard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="52%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect width="420" height="250" fill="url(#viceSunsetCard)" />
      <circle cx="332" cy="64" r="42" fill="#fef08a" stroke="#09050f" strokeWidth="4" />
      <polygon points="0,250 115,138 225,250" fill="#13091f" />
      <polygon points="150,250 295,118 420,250" fill="#1e1b4b" />
      <circle cx="195" cy="96" r="28" fill="#fed7aa" stroke="#09050f" strokeWidth="4" />
      <rect x="148" y="126" width="94" height="114" rx="18" fill="#0f172a" stroke="#09050f" strokeWidth="4" />
      <rect x="16" y="18" width="235" height="34" rx="6" fill="#09050f" fillOpacity="0.82" />
      <text x="28" y="40" fontSize="13" fontWeight="800" fill="#fde68a">
        ✨ GOLDEN-HOUR FIRST IMPRESSION
      </text>
    </svg>
  );
};

export const SceneMosaicBanner: React.FC<{
  sceneArt: Episode['sceneArt'];
  act: 2 | 3;
  isVip: boolean;
}> = ({ sceneArt, act, isVip }) => {
  const sceneBadges: Record<Episode['sceneArt'], { emoji: string; label: string; gradient: string }> = {
    tapas_check: {
      emoji: '🍸💳',
      label: 'TAPAS LOUNGE • THE CHECK DROP',
      gradient: 'from-rose-600 via-fuchsia-700 to-amber-500',
    },
    waiter_shock: {
      emoji: '🍷😳',
      label: 'HOST STAND • "TABLE FOR YOU & YOUR SON?"',
      gradient: 'from-pink-600 via-purple-800 to-teal-500',
    },
    code_switch_phone: {
      emoji: '📱🧠',
      label: 'GENERATIONAL TRANSLATOR • TEXT & CALL PROTOCOL',
      gradient: 'from-teal-600 via-indigo-800 to-pink-600',
    },
    babysitter_clock: {
      emoji: '☔⏱️',
      label: '$20/HR SITTER CLOCK • PRECIOUS FRIDAY NIGHT',
      gradient: 'from-amber-500 via-rose-700 to-slate-900',
    },
    princess_bouquet: {
      emoji: '👑💐',
      label: 'SOFT-LIFE ROYALTY • ZERO MENTAL LOAD',
      gradient: 'from-pink-500 via-rose-500 to-amber-400',
    },
    ridge_trail_leash: {
      emoji: '🏃‍♀️⛰️',
      label: '6:10 AM CANYON SWITCHBACKS • SHORT LEASH PACE',
      gradient: 'from-emerald-600 via-teal-700 to-amber-500',
    },
    mirror_vanity: {
      emoji: '☀️🪞',
      label: 'MORNING SUNLIGHT • SECRET MIRROR & GAME DOUBTS',
      gradient: 'from-amber-400 via-rose-500 to-indigo-800',
    },
    houseboy_apron: {
      emoji: '🧹🥂',
      label: 'SOLO SANCTUARY • EARNED LINEN-APRON SUNDAY',
      gradient: 'from-fuchsia-600 via-rose-600 to-amber-500',
    },
    fertility_talk: {
      emoji: '🌙🍷',
      label: 'ACT III BOSS • THE KIDS & TIMELINE CROSSROADS',
      gradient: 'from-indigo-700 via-purple-800 to-rose-600',
    },
    brunch_daughter: {
      emoji: '🥂🥑',
      label: 'ACT III FINALE • BRUNCH WITH HER 22YO DAUGHTER',
      gradient: 'from-amber-500 via-pink-600 to-purple-800',
    },
    bathroom_audit: {
      emoji: '🧼🗑️',
      label: 'VIP DEEP-CUT • HIS APARTMENT LIDDED-BIN AUDIT',
      gradient: 'from-teal-500 via-cyan-700 to-slate-900',
    },
    palm_springs_pool: {
      emoji: '🌴🕶️',
      label: 'VIP DEEP-CUT • 5-STAR PALM SPRINGS INCOME GAP',
      gradient: 'from-orange-500 via-pink-600 to-teal-500',
    },
    thanksgiving_table: {
      emoji: '🥧🍂',
      label: 'VIP DEEP-CUT • THANKSGIVING CLASS-OF-’97 CROSSOVER',
      gradient: 'from-amber-600 via-red-700 to-purple-900',
    },
    trader_joes_aisle: {
      emoji: '🫒🛒',
      label: 'VIP DEEP-CUT • IN-THE-WILD OLIVE OIL AISLE SHOT',
      gradient: 'from-emerald-600 via-amber-500 to-rose-600',
    },
  };

  const info = sceneBadges[sceneArt];

  return (
    <div
      className={`vice-panel relative overflow-hidden rounded-2xl bg-gradient-to-r ${info.gradient} p-4 sm:p-5`}
    >
      <div className="absolute -right-6 -top-6 h-28 w-28 rotate-12 rounded-full bg-black/25 border-2 border-white/20" />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md bg-black/75 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <span>ACT {act === 2 ? 'II' : 'III'}</span>
            {isVip && <span className="text-pink-400">• VIP DEEP-CUT</span>}
          </div>
          <p className="mt-2 font-display text-2xl sm:text-3xl text-white drop-shadow-[2px_2px_0px_#09050f]">
            {info.label}
          </p>
        </div>
        <div className="text-4xl sm:text-5xl drop-shadow-[3px_3px_0px_#09050f] select-none">
          {info.emoji}
        </div>
      </div>
    </div>
  );
};
