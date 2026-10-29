'use client';

import React, { useState, useId } from 'react';

type AssetCategory = 'ALL' | 'EARTHMOVING' | 'GENERATOR' | 'COMPACTION' | 'CRANE';
type OperationalStatus = 'AVAILABLE' | 'ALLOCATED_PENDING_DISPATCH' | 'ON_HIRE_ACTIVE' | 'DEPOT_RECONCILE' | 'MAINTENANCE_HOLD';

interface PlantAsset {
  id: string;
  serialNumber: string;
  modelName: string;
  category: Exclude<AssetCategory, 'ALL'>;
  dailyRateKobo: bigint;
  depositRateKobo: bigint;
  mobilizationFeeKobo: bigint;
  operationalStatus: OperationalStatus;
  totalHoursRun: number;
  specs: string;
}

// Certified operator fixed day rate per PRD Section 4.2 (₦35,000 / day in Kobo)
const OPERATOR_DAY_RATE_KOBO = BigInt(3500000);

// Initial authoritative depot fleet state
const DEPOT_FLEET: PlantAsset[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    serialNumber: 'CAT-320D-2024-01',
    modelName: 'Caterpillar 320D Hydraulic Excavator',
    category: 'EARTHMOVING',
    dailyRateKobo: BigInt(22000000), // ₦220,000 / day
    depositRateKobo: BigInt(50000000), // ₦500,000
    mobilizationFeeKobo: BigInt(15000000), // ₦150,000
    operationalStatus: 'AVAILABLE',
    totalHoursRun: 4210.5,
    specs: '20-Tonne Operating Weight, 1.2m³ Heavy Duty Bucket',
  },
  {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    serialNumber: 'FGW-500-2023-04',
    modelName: 'FG Wilson 500kVA Industrial Generator',
    category: 'GENERATOR',
    dailyRateKobo: BigInt(18000000), // ₦180,000 / day
    depositRateKobo: BigInt(40000000), // ₦400,000
    mobilizationFeeKobo: BigInt(12000000), // ₦120,000
    operationalStatus: 'AVAILABLE',
    totalHoursRun: 1845.0,
    specs: 'Perkins Diesel Engine, 400V 50Hz, Acoustic Soundproof Canopy',
  },
  {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    serialNumber: 'BOM-BW211-2023-02',
    modelName: 'Bomag BW211 D-5 Single Drum Roller',
    category: 'COMPACTION',
    dailyRateKobo: BigInt(14000000), // ₦140,000 / day
    depositRateKobo: BigInt(30000000), // ₦300,000
    mobilizationFeeKobo: BigInt(10000000), // ₦100,000
    operationalStatus: 'ALLOCATED_PENDING_DISPATCH',
    totalHoursRun: 2120.0,
    specs: '11-Tonne Soil Compactor, High-Amplitude Vibratory System',
  },
  {
    id: 'e2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    serialNumber: 'TAD-GR550-2022-01',
    modelName: 'Tadano GR-550XL Rough Terrain Crane',
    category: 'CRANE',
    dailyRateKobo: BigInt(35000000), // ₦350,000 / day
    depositRateKobo: BigInt(80000000), // ₦800,000
    mobilizationFeeKobo: BigInt(25000000), // ₦250,000
    operationalStatus: 'ON_HIRE_ACTIVE',
    totalHoursRun: 3410.2,
    specs: '50-Tonne Max Capacity, 4-Section Full Power Boom (34.7m)',
  },
];

function formatNairaFromKobo(kobo: bigint): string {
  const naira = Number(kobo) / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(naira);
}

export default function FleetCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('ALL');
  const [hireDurationDays, setHireDurationDays] = useState<number>(7);
  const [isWetHire, setIsWetHire] = useState<boolean>(true);
  const wetHireCheckboxId = useId();

  const filteredFleet = selectedCategory === 'ALL'
    ? DEPOT_FLEET
    : DEPOT_FLEET.filter((asset) => asset.category === selectedCategory);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-on-surface)',
        minHeight: '100vh',
        padding: '2rem 1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation & Operational Status Bar */}
        <header
          style={{
            borderBottom: '1px solid var(--color-outline)',
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-primary)',
                  marginBottom: '0.25rem',
                }}
              >
                EquipPro Plant Hire • Lagos Central Depot
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.5vw + 0.5rem, 3rem)',
                  lineHeight: 1.2,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  margin: 0,
                  color: 'var(--color-primary)',
                }}
              >
                Heavy Plant & Logistics Fleet
              </h1>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--color-surface-container)',
                padding: '0.625rem 1.125rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-outline)',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Mobilization SLA: <strong style={{ color: 'var(--color-primary)' }}>≤ 120s Clearance</strong>
              </span>
            </div>
          </div>
        </header>

        {/* Global Hire Calculation Controls */}
        <section
          aria-label="Rental configuration"
          style={{
            backgroundColor: 'var(--color-surface-container)',
            borderRadius: '0.75rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            border: '1px solid var(--color-outline)',
            boxShadow: 'var(--elevation-task-soft-shadow)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Category Filter Tabs */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.5rem',
                }}
              >
                Machinery Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(['ALL', 'EARTHMOVING', 'GENERATOR', 'COMPACTION', 'CRANE'] as AssetCategory[]).map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderRadius: '0.375rem',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-outline)',
                        backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hire Duration & Wet Hire Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <label
                  htmlFor="hireDuration"
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-on-surface-variant)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Hire Duration (Days)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setHireDurationDays((d) => Math.max(1, d - 1))}
                    style={{
                      padding: '0.375rem 0.875rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-on-surface)',
                      border: '1px solid var(--color-outline)',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                    }}
                    aria-label="Decrease duration"
                  >
                    -
                  </button>
                  <span
                    id="hireDuration"
                    style={{
                      minWidth: '2.5rem',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                    }}
                  >
                    {hireDurationDays}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHireDurationDays((d) => d + 1)}
                    style={{
                      padding: '0.375rem 0.875rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-on-surface)',
                      border: '1px solid var(--color-outline)',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                    }}
                    aria-label="Increase duration"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Wet Hire Toggle (₦35,000/day operator surcharge) */}
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-on-surface-variant)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Operator Option
                </span>
                <label
                  htmlFor={wetHireCheckboxId}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '0.375rem',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-outline)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <input
                    id={wetHireCheckboxId}
                    type="checkbox"
                    checked={isWetHire}
                    onChange={(e) => setIsWetHire(e.target.checked)}
                    style={{
                      width: '1.125rem',
                      height: '1.125rem',
                      accentColor: 'var(--color-primary)',
                      cursor: 'pointer',
                    }}
                  />
                  <span>
                    Wet Hire{' '}
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.8125rem' }}>
                      (+₦35,000/day operator)
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Machinery Cards Grid */}
        <section aria-label="Available fleet machinery">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredFleet.map((asset) => {
              const daysBigInt = BigInt(hireDurationDays);
              const operatorSurchargeKobo = isWetHire ? OPERATOR_DAY_RATE_KOBO * daysBigInt : BigInt(0);
              const baseRentalKobo = asset.dailyRateKobo * daysBigInt;
              const totalDueKobo = baseRentalKobo + operatorSurchargeKobo + asset.mobilizationFeeKobo + asset.depositRateKobo;

              const isAvailable = asset.operationalStatus === 'AVAILABLE';

              return (
                <article
                  key={asset.id}
                  style={{
                    backgroundColor: 'var(--color-surface-container)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid var(--color-outline)',
                    boxShadow: 'var(--elevation-task-soft-shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Header: Serial & Operational Status Badge */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'var(--color-on-surface-variant)',
                        }}
                      >
                        {asset.serialNumber}
                      </span>

                      {/* Accessible 3-part non-color status indicator */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.625rem',
                          borderRadius: '1rem',
                          border: `1px solid ${isAvailable ? 'var(--color-success)' : 'var(--color-outline)'}`,
                          backgroundColor: isAvailable ? 'var(--color-surface)' : 'var(--color-surface-container)',
                          color: isAvailable ? 'var(--color-success)' : 'var(--color-on-surface-variant)',
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                          <circle
                            cx="5"
                            cy="5"
                            r="4"
                            fill={isAvailable ? 'var(--color-success)' : 'var(--color-outline)'}
                          />
                        </svg>
                        {asset.operationalStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        margin: '0 0 0.5rem 0',
                        color: 'var(--color-on-surface)',
                      }}
                    >
                      {asset.modelName}
                    </h2>

                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-on-surface-variant)',
                        margin: '0 0 1.25rem 0',
                        lineHeight: 1.4,
                      }}
                    >
                      {asset.specs}
                    </p>

                    {/* Telematics / Service Hours Indicator */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8125rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: '0.375rem',
                        border: '1px solid var(--color-outline)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <span>Operating Runtime:</span>
                      <strong>{asset.totalHoursRun.toFixed(1)} hrs</strong>
                    </div>

                    {/* Itemized Pricing Breakdown */}
                    <div
                      style={{
                        fontSize: '0.875rem',
                        borderTop: '1px solid var(--color-outline)',
                        paddingTop: '0.875rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>
                          Base Rate ({hireDurationDays} days):
                        </span>
                        <span>{formatNairaFromKobo(baseRentalKobo)}</span>
                      </div>
                      {isWetHire && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                          <span style={{ color: 'var(--color-on-surface-variant)' }}>
                            Certified Operator:
                          </span>
                          <span>{formatNairaFromKobo(operatorSurchargeKobo)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>
                          Mobilization Transport:
                        </span>
                        <span>{formatNairaFromKobo(asset.mobilizationFeeKobo)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>
                          Refundable Security Deposit:
                        </span>
                        <span>{formatNairaFromKobo(asset.depositRateKobo)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Total Commitment & Mobilization Action */}
                  <div
                    style={{
                      borderTop: '1px solid var(--color-outline)',
                      paddingTop: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.875rem' }}>
                      <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>
                        Total Mobilization:
                      </span>
                      <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {formatNairaFromKobo(totalDueKobo)}
                      </span>
                    </div>

                    <a
                      href={isAvailable ? `/auth?mode=register` : undefined}
                      aria-disabled={!isAvailable}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '0.375rem',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        textDecoration: 'none',
                        backgroundColor: isAvailable ? 'var(--color-primary)' : 'var(--color-outline)',
                        color: 'var(--color-on-primary)',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        boxShadow: isAvailable ? 'var(--elevation-task-medium-shadow)' : 'none',
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      {isAvailable ? 'Mobilize Plant Asset' : 'Locked for Allocation'}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

