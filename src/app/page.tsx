'use client';

import React from 'react';
import Link from 'next/link';

export default function MinimalistStatusHomepage() {
  return (
    <main
      role="main"
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-on-surface)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 3rem',
      }}
    >
      {/* Top Header: Brand & Live Depot Status */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-outline)',
          paddingBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontSize: 'var(--font-title-medium-size, 1rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-primary)',
            }}
          >
            EquipPro Plant Hire
          </span>
          <span style={{ color: 'var(--color-outline)' }}>|</span>
          <span
            style={{
              fontSize: 'var(--font-body-medium-size, 0.875rem)',
              color: 'var(--color-on-surface-variant)',
            }}
          >
            Lagos Central Depot
          </span>
        </div>

        {/* Live Depot Telematics Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '1rem',
            border: '1px solid var(--color-success)',
            backgroundColor: 'var(--color-surface-container)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <circle cx="5" cy="5" r="4" fill="var(--color-success)" />
          </svg>
          <span
            style={{
              fontSize: 'var(--font-label-medium-size, 0.75rem)',
              fontWeight: 700,
              color: 'var(--color-success)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Depot Online • Fleet Available
          </span>
        </div>
      </header>

      {/* Center Hero & Operational Readiness Grid */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '960px',
          margin: '0 auto',
          gap: '1.75rem',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: 'var(--font-label-large-size, 0.875rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-primary)',
              marginBottom: '0.75rem',
            }}
          >
            Industrial Heavy Equipment & Fleet Logistics
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 4vw + 1rem, 3.5rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 1rem 0',
              color: 'var(--color-primary)',
            }}
          >
            Authoritative Plant Mobilization
          </h1>
          <p
            style={{
              fontSize: 'var(--font-title-large-size, 1.375rem)',
              lineHeight: 1.4,
              color: 'var(--color-on-surface-variant)',
              maxWidth: '780px',
              margin: '0 auto',
            }}
          >
            Heavy earthmoving machinery, industrial power generators, and compaction plant engineered for high-glare Lagos construction operations.
          </p>
        </div>

        {/* Operational Status Badges (3 Pillars) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            width: '100%',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid var(--color-outline)',
              borderRadius: '0.5rem',
              padding: '1.25rem',
              boxShadow: 'var(--elevation-task-soft-shadow)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontSize: 'var(--font-label-large-size, 0.875rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '0.25rem',
              }}
            >
              Gate Pass SLA
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
              ≤ 120s
            </div>
            <div style={{ fontSize: 'var(--font-body-small-size, 0.75rem)', color: 'var(--color-on-surface-variant)' }}>
              Cryptographic dispatch clearance
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid var(--color-outline)',
              borderRadius: '0.5rem',
              padding: '1.25rem',
              boxShadow: 'var(--elevation-task-soft-shadow)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontSize: 'var(--font-label-large-size, 0.875rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '0.25rem',
              }}
            >
              Maintenance Gate
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
              250 Hours
            </div>
            <div style={{ fontSize: 'var(--font-body-small-size, 0.75rem)', color: 'var(--color-on-surface-variant)' }}>
              Hard preventative engine lockout
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid var(--color-outline)',
              borderRadius: '0.5rem',
              padding: '1.25rem',
              boxShadow: 'var(--elevation-task-soft-shadow)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontSize: 'var(--font-label-large-size, 0.875rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '0.25rem',
              }}
            >
              Ledger Purity
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-on-surface)' }}>
              Dual-Ledger
            </div>
            <div style={{ fontSize: 'var(--font-body-small-size, 0.75rem)', color: 'var(--color-on-surface-variant)' }}>
              Integer Kobo statutory retention
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Link
            href="/catalog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.875rem 2rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 'var(--font-body-large-size, 1rem)',
              boxShadow: 'var(--elevation-task-medium-shadow)',
            }}
          >
            Browse Fleet Catalog & Mobilize
          </Link>
          <Link
            href="/auth?mode=login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.875rem 2rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--color-surface-container)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-outline)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 'var(--font-body-large-size, 1rem)',
            }}
          >
            Contractor Portal Login
          </Link>
        </div>
      </section>

      {/* Bottom Footer: Compliance & Audit Status */}
      <footer
        style={{
          borderTop: '1px solid var(--color-outline)',
          paddingTop: '0.875rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--font-body-small-size, 0.75rem)',
          color: 'var(--color-on-surface-variant)',
        }}
      >
        <div>
          CAMA 2020 & NDPA Compliant • 7-Year Statutory Tax Ledger Audit Defense
        </div>
        <div>
          Industrial Forge Rust (Tone 40 Primary Anchor) • WCAG AAA $\ge 7:1$ High-Contrast
        </div>
      </footer>
    </main>
  );
}
