'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { DonorProvider } from '@/context/DonorContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DonorProvider>
        {children}
      </DonorProvider>
    </AuthProvider>
  );
}
