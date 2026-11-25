import '@testing-library/jest-dom/vitest';

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => ({
    createLinearGradient: () => ({ addColorStop: () => {} }),
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
