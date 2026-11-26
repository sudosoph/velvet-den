import React from 'react';
import type { AffiliateProduct, AffiliateVisualMotif } from '../lib/affiliates';

interface ProductVisualThumbnailProps {
  item: AffiliateProduct;
  compact?: boolean;
}

function renderMotifIllustration(motif: AffiliateVisualMotif): React.ReactNode {
  switch (motif) {
    case 'apron_leopard':
    case 'apron_trophy':
    case 'apron_linen':
      return (
        <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
          <path
            d="M34 14 C34 8, 62 8, 62 14 L64 26 L78 38 L72 82 C72 85, 24 85, 24 82 L18 38 L32 26 Z"
            fill={motif === 'apron_leopard' ? '#F59E0B' : motif === 'apron_trophy' ? '#1E1022' : '#E7DEC8'}
            stroke="#1E1022"
            strokeWidth="3.5"
          />
          {motif === 'apron_leopard' && (
            <g fill="#1E1022" opacity="0.82">
              <circle cx="38" cy="40" r="4" />
              <circle cx="56" cy="36" r="3.5" />
              <circle cx="48" cy="54" r="4.5" />
              <circle cx="33" cy="64" r="3.5" />
              <circle cx="61" cy="66" r="4" />
            </g>
          )}
          <rect
            x="33"
            y="52"
            width="30"
            height="18"
            rx="4"
            fill="#FFFDF9"
            stroke="#1E1022"
            strokeWidth="2.5"
          />
        </svg>
      );
    case 'clicker_brass':
      return (
        <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
          <path
            d="M56 56 C76 58, 84 76, 68 84 C54 90, 44 74, 52 60"
            fill="none"
            stroke="#FF2E63"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect
            x="22"
            y="22"
            width="44"
            height="52"
            rx="20"
            fill="#FBBF24"
            stroke="#1E1022"
            strokeWidth="3.5"
          />
          <circle cx="44" cy="44" r="11" fill="#FFFDF9" stroke="#1E1022" strokeWidth="3" />
          <path d="M16 18 L24 24 M70 16 L62 23 M44 8 L44 16" stroke="#1E1022" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'wine_goblet':
    case 'copper_shaker':
    case 'botanical_elixir':
      return (
        <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
          {motif === 'copper_shaker' ? (
            <g>
              <polygon points="34,26 62,26 56,78 40,78" fill="#D97706" stroke="#1E1022" strokeWidth="3.5" />
              <rect x="38" y="16" width="20" height="10" rx="4" fill="#FBBF24" stroke="#1E1022" strokeWidth="3" />
              <line x1="33" y1="38" x2="63" y2="38" stroke="#1E1022" strokeWidth="3" />
            </g>
          ) : (
            <g>
              <path
                d="M28 16 H68 C68 44, 58 54, 48 54 C38 54, 28 44, 28 16 Z"
                fill="#FFFDF9"
                stroke="#1E1022"
                strokeWidth="3.5"
              />
              <path
                d="M31 30 H65 C63 44, 56 51, 48 51 C40 51, 33 44, 31 30 Z"
                fill={motif === 'botanical_elixir' ? '#FB7185' : '#BE123C'}
              />
              <line x1="48" y1="54" x2="48" y2="80" stroke="#1E1022" strokeWidth="3.5" />
              <line x1="34" y1="80" x2="62" y2="80" stroke="#1E1022" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
        </svg>
      );
    case 'cinema_poster':
      return (
        <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
          <rect x="20" y="12" width="56" height="72" rx="8" fill="#1E1022" stroke="#FFBE0B" strokeWidth="3.5" />
          <rect x="26" y="18" width="44" height="40" rx="4" fill="#FF2E63" />
          <polygon points="44,30 44,46 57,38" fill="#FFFDF9" />
          <line x1="28" y1="66" x2="68" y2="66" stroke="#FFBE0B" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="34" y1="74" x2="62" y2="74" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'lidded_bin_soap':
      return (
        <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
          <rect x="20" y="34" width="32" height="46" rx="5" fill="#1E1022" stroke="#1E1022" strokeWidth="3" />
          <rect x="18" y="27" width="36" height="7" rx="3.5" fill="#FFBE0B" stroke="#1E1022" strokeWidth="3" />
          <rect x="58" y="42" width="22" height="38" rx="6" fill="#92400E" stroke="#1E1022" strokeWidth="3" />
          <path d="M69 42 V32 H77" fill="none" stroke="#1E1022" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
          <rect
            x="18"
            y="20"
            width="60"
            height="56"
            rx="14"
            fill="#FFFDF9"
            stroke="#1E1022"
            strokeWidth="3.5"
          />
          <path d="M18 38 H78" stroke="#1E1022" strokeWidth="3" />
          <circle cx="48" cy="38" r="8" fill="#FF2E63" stroke="#1E1022" strokeWidth="2.5" />
        </svg>
      );
  }
}

export const ProductVisualThumbnail: React.FC<ProductVisualThumbnailProps> = ({
  item,
  compact = false,
}) => {
  const { visualSpec } = item;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-[#1E1022] select-none ${
        compact ? 'h-20 w-20 shrink-0' : 'h-32 w-full'
      }`}
      style={{
        background: `linear-gradient(135deg, ${visualSpec.accentFrom} 0%, ${visualSpec.accentTo} 100%)`,
      }}
      data-testid={`product-visual-${item.id}`}
    >
      <div className="absolute inset-0 flex items-center justify-center p-2.5">
        <div className={compact ? 'h-14 w-14' : 'h-24 w-24'}>
          {renderMotifIllustration(visualSpec.motif)}
        </div>
      </div>
      <span
        className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full border border-[#1E1022] bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-[#1E1022] shadow-xs"
      >
        <span>{visualSpec.emoji}</span>
        {!compact && <span>{visualSpec.studioLabel}</span>}
      </span>
      {!compact && (
        <span className="absolute bottom-1.5 right-1.5 rounded-full border border-[#1E1022] bg-[#1E1022] px-2 py-0.5 text-[10px] font-extrabold text-[#FFBE0B]">
          {item.priceDisplay}
        </span>
      )}
    </div>
  );
};
