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
  const photoSrc = item.photoUrl || resolveProductPhotoUrl(item.id);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white select-none ${
        compact ? 'h-20 w-20 shrink-0' : 'h-44 w-full'
      }`}
      data-testid={`product-visual-${item.id}`}
    >
      <img
        src={photoSrc}
        alt={item.name}
        loading="lazy"
        className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};
