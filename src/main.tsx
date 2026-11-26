import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PostHogProvider } from '@posthog/react';
import './index.css';
import App from './App';
import { initPostHogClient } from './lib/analytics';

const posthogClient = initPostHogClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {posthogClient ? (
      <PostHogProvider client={posthogClient}>
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
);
