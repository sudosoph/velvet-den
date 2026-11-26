import React from 'react';
import { resolveProductPhotoUrl } from '../data/v35AssetManifest';
import type { AffiliateProduct } from '../lib/affiliates';

interface ProductVisualThumbnailProps {
  item: AffiliateProduct;
  compact?: boolean;
}

export const ProductVisualThumbnail: React.FC<ProductVisualThumbnailProps> = ({
  item,
  compact = false,
}) => {
  const { visualSpec } = item;
  const photoSrc = item.photoUrl || resolveProductPhotoUrl(item.id);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-stone-200 bg-[#FDFBF7] select-none ${
        compact ? 'h-20 w-20 shrink-0' : 'h-44 w-full'
      }`}
      data-testid={`product-visual-${item.id}`}
    >
      <img
        src={photoSrc}
        alt={item.name}
        loading="lazy"
        className="h-full w-full object-contain p-1.5 transition-transform duration-300 hover:scale-105"
      />
      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/80 px-2.5 py-0.5 text-[10px] font-extrabold text-[#18101E] shadow-xs">
        <span>{visualSpec.emoji}</span>
        {!compact && <span>{visualSpec.studioLabel}</span>}
      </span>
      {!compact && (
        <span className="absolute bottom-2 right-2 rounded-full bg-[#18101E]/90 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300 shadow-xs">
          {item.priceDisplay}
        </span>
      )}
    </div>
  );
};
