'use client';

import React, { useState, useId, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'login' | 'register' | 'reset';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query parameter switching contract: ?mode=login (default fallback), ?mode=register, ?mode=reset
  const rawMode = searchParams.get('mode');
  const activeMode: AuthMode = (rawMode === 'register' || rawMode === 'reset') ? rawMode : 'login';

  const setMode = (mode: AuthMode) => {
    router.push(`/auth?mode=${mode}`);
  };

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [cacNumber, setCacNumber] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [resetEmail, setResetEmail] = useState('');

  // Validation error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Accessible IDs
  const companyNameId = useId();
  const cacNumberId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const termsId = useId();
  const resetEmailId = useId();

  // Nigerian validation standards per PRD Section 4.1 & validation-rules.md
  const validateRegister = () => {
    const errs: Record<string, string> = {};

    if (!companyName.trim() || companyName.trim().length < 3) {
      errs.companyName = 'Company name must be at least 3 characters.';
    }

    const cacRegex = /^(RC|BN|IT|LLP)-?\d{6,8}$/i;
    if (!cacRegex.test(cacNumber.trim())) {
      errs.cacNumber = 'Must match valid Nigerian CAC format (e.g., RC-123456 or BN-654321).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      errs.email = 'Please provide a valid corporate email address.';
    }

    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.trim().replace(/[\s-]/g, ''))) {
      errs.phoneNumber = 'Must be a valid Nigerian mobile number (e.g., 08012345678 or +2348012345678).';
    }

    if (regPassword.length < 12) {
      errs.password = 'Passphrase must be at least 12 characters.';
    }

    if (!termsAccepted) {
      errs.terms = 'You must accept the standard plant hire terms and liability conditions.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!validateRegister()) return;

    // Normalize phone to E.164 and email to lowercase
    const cleanPhone = phoneNumber.trim().replace(/[\s-]/g, '');
    const e164Phone = cleanPhone.startsWith('+234')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `+234${cleanPhone.slice(1)}`
      : `+234${cleanPhone}`;

    const normalizedEmail = regEmail.trim().toLowerCase();

    setStatusMessage(`Verification code dispatched to ${normalizedEmail}. Phone registered: ${e164Phone}`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatusMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      setErrors({ loginEmail: 'Please enter a valid email address.' });
      return;
    }

    if (!loginPassword) {
      setErrors({ loginPassword: 'Password is required.' });
      return;
    }

    setStatusMessage(`Signing in contractor account for ${loginEmail.trim().toLowerCase()}...`);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatusMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) {
      setErrors({ resetEmail: 'Please enter a valid email address.' });
      return;
    }

    setStatusMessage(`Password reset link dispatched to ${resetEmail.trim().toLowerCase()} if registered.`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-on-surface)',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--color-surface-container)',
          borderRadius: '0.75rem',
          border: '1px solid var(--color-outline)',
          boxShadow: 'var(--elevation-task-medium-shadow)',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Header with Brand & Mode Switcher */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link
            href="/catalog"
            style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              marginBottom: '0.5rem',
            }}
          >
            ← EquipPro Fleet Depot
          </Link>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2rem)',
              fontWeight: 800,
              margin: '0 0 0.5rem 0',
              color: 'var(--color-primary)',
            }}
          >
            {activeMode === 'login' && 'Contractor Portal Sign In'}
            {activeMode === 'register' && 'Corporate Registration'}
            {activeMode === 'reset' && 'Password Recovery'}
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-on-surface-variant)',
              margin: 0,
            }}
          >
            {activeMode === 'login' && 'Access fleet bookings, mobilization gate passes, and deposit ledgers.'}
            {activeMode === 'register' && 'Register your civil engineering or contracting entity for heavy plant lease.'}
            {activeMode === 'reset' && 'Receive an authenticated reset link via corporate email.'}
          </p>
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div
            role="status"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 1: LOGIN                                                     */}
        {/* ================================================================= */}
        {activeMode === 'login' && (
          <form onSubmit={handleLoginSubmit} noValidate>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor={emailId}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.375rem',
                }}
              >
                Corporate Email Address
              </label>
              <input
                id={emailId}
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                aria-invalid={!!errors.loginEmail}
                aria-describedby={errors.loginEmail ? `${emailId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.loginEmail ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.loginEmail && (
                <div
                  id={`${emailId}-error`}
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    color: 'var(--color-error)',
                    fontSize: '0.75rem',
                    marginTop: '0.375rem',
                    fontWeight: 600,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors.loginEmail}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label
                  htmlFor={passwordId}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-on-surface-variant)',
                  }}
                >
                  Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--color-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Forgot Passphrase?
                </button>
              </div>
              <input
                id={passwordId}
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                aria-invalid={!!errors.loginPassword}
                aria-describedby={errors.loginPassword ? `${passwordId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.loginPassword ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.loginPassword && (
                <div
                  id={`${passwordId}-error`}
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    color: 'var(--color-error)',
                    fontSize: '0.75rem',
                    marginTop: '0.375rem',
                    fontWeight: 600,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors.loginPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--elevation-task-soft-shadow)',
              }}
            >
              Sign In to Contractor Portal
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-on-surface-variant)' }}>Need an enterprise account? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Register Corporate Entity
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* MODE 2: REGISTER                                                  */}
        {/* ================================================================= */}
        {activeMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} noValidate>
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor={companyNameId}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.375rem',
                }}
              >
                Contractor / Corporate Name
              </label>
              <input
                id={companyNameId}
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Julius Construction Ltd"
                aria-invalid={!!errors.companyName}
                aria-describedby={errors.companyName ? `${companyNameId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.companyName ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.companyName && (
                <div id={`${companyNameId}-error`} role="alert" style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>
                  {errors.companyName}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor={cacNumberId}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.375rem',
                }}
              >
                CAC / RC Registration Number
              </label>
              <input
                id={cacNumberId}
                type="text"
                value={cacNumber}
                onChange={(e) => setCacNumber(e.target.value.toUpperCase())}
                placeholder="RC-123456 or BN-987654"
                aria-invalid={!!errors.cacNumber}
                aria-describedby={errors.cacNumber ? `${cacNumberId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.cacNumber ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.cacNumber && (
                <div id={`${cacNumberId}-error`} role="alert" style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>
                  {errors.cacNumber}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor={emailId}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.375rem',
                }}
              >
                Official Corporate Email
              </label>
              <input
                id={emailId}
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="procurement@company.ng"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${emailId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.email ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <div id={`${emailId}-error`} role="alert" style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor={phoneId}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.375rem',
                }}
              >
                Site Dispatch Phone Number
              </label>
              <input
                id={phoneId}
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08012345678 or +234..."
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={errors.phoneNumber ? `${phoneId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.phoneNumber ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.phoneNumber && (
                <div id={`${phoneId}-error`} role="alert" style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>
                  {errors.phoneNumber}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor={passwordId}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.375rem',
                }}
              >
                Secure Passphrase (Min 12 Chars)
              </label>
              <input
                id={passwordId}
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimum 12 characters"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? `${passwordId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.password ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.password && (
                <div id={`${passwordId}-error`} role="alert" style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Terms & Conditions Acceptance Protocol (Mandatory checkbox) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor={termsId}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-on-surface-variant)',
                  cursor: 'pointer',
                  lineHeight: 1.4,
                }}
              >
                <input
                  id={termsId}
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{
                    width: '1.125rem',
                    height: '1.125rem',
                    marginTop: '0.125rem',
                    accentColor: 'var(--color-primary)',
                    cursor: 'pointer',
                  }}
                />
                <span>
                  I accept the <strong>Standard Plant Hire Conditions</strong>, deposit forfeiture liability, and statutory dispute protocols.
                </span>
              </label>
              {errors.terms && (
                <div role="alert" style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 600 }}>
                  {errors.terms}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!termsAccepted}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: termsAccepted ? 'var(--color-primary)' : 'var(--color-outline)',
                color: 'var(--color-on-primary)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: termsAccepted ? 'pointer' : 'not-allowed',
                boxShadow: termsAccepted ? 'var(--elevation-task-soft-shadow)' : 'none',
              }}
            >
              Create Corporate Account
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-on-surface-variant)' }}>Already have an account? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* MODE 3: RESET PASSWORD                                            */}
        {/* ================================================================= */}
        {activeMode === 'reset' && (
          <form onSubmit={handleResetSubmit} noValidate>
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor={resetEmailId}
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-on-surface-variant)',
                  marginBottom: '0.375rem',
                }}
              >
                Account Email Address
              </label>
              <input
                id={resetEmailId}
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="registered@contractor.ng"
                aria-invalid={!!errors.resetEmail}
                aria-describedby={errors.resetEmail ? `${resetEmailId}-error` : undefined}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${errors.resetEmail ? 'var(--color-error)' : 'var(--color-outline)'}`,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.9375rem',
                  boxSizing: 'border-box',
                }}
              />
              {errors.resetEmail && (
                <div id={`${resetEmailId}-error`} role="alert" style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 600 }}>
                  {errors.resetEmail}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--elevation-task-soft-shadow)',
              }}
            >
              Request Password Reset Link
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                ← Return to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            fontWeight: 700,
          }}
        >
          Loading Authentication Canvas...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}

