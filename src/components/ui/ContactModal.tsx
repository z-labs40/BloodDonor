'use client';

import { useState } from 'react';
import { Donor } from '@/types';
import { Phone, X, Copy, Check } from 'lucide-react';

interface ContactModalProps {
  donor: Donor | null;
  onClose: () => void;
}

export default function ContactModal({ donor, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  if (!donor) return null;
  const donorName = donor.user?.name ?? 'Unknown';

  const handleCopy = () => {
    if (!donor.phone) return;
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-scale-in"
        style={{ maxWidth: '400px', width: '100%', padding: '32px', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(185,28,28,0.3))',
            border: '2px solid rgba(220,38,38,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px', fontWeight: 700, color: '#fca5a5',
          }}>
            {donorName.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{donorName}</h2>
          <div className="blood-badge" style={{ margin: '0 auto 8px', display: 'inline-flex' }}>{donor.bloodGroupDisplay ?? donor.bloodGroup}</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {donor.department} · {donor.year}
          </p>
        </div>

        <div style={{
          background: 'rgba(220,38,38,0.06)',
          border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={18} color="#ef4444" />
            <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '0.5px' }}>{donor.phone ?? 'N/A'}</span>
          </div>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? 'var(--success-soft)' : 'rgba(255,255,255,0.06)',
              border: '1px solid',
              borderColor: copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
              color: copied ? 'var(--success)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Please reach out respectfully. Only contact for genuine blood donation emergencies.
        </p>
      </div>
    </div>
  );
}
