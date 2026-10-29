import type { Metadata } from 'next';
import React from 'react';
import '../styles/tokens.css';

export const metadata: Metadata = {
  title: 'EquipPro Plant Hire • Industrial Heavy Equipment & Logistics',
  description: 'Authoritative commercial and operational equipment leasing and fleet logistics across Lagos, Nigeria.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-on-surface)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </body>
    </html>
  );
}

