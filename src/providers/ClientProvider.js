// app/providers/ClientProvider.tsx
'use client';

import { Provider as JotaiProvider } from 'jotai';

export function ClientProvider({ children }) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
