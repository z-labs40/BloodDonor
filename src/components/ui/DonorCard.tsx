'use client';

import { Donor } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin, BookOpen, Calendar, Phone, Heart, CheckCircle, Clock, XCircle
} from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
  onContact?: (donor: Donor) => void;
}

const statusConfig = {
  verified: { label: 'Verified', icon: CheckCircle, className: 'status-verified' },
  pending: { label: 'Pending', icon: Clock, className: 'status-pending' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'status-rejected' },
};

export default function DonorCard({ donor, onContact }: DonorCardProps) {
  const { user } = useAuth();
  const status = statusConfig[donor.status];
  const StatusIcon = status.icon;

  return (
    <div
      className="glass-card animate-scale-in"
      style={{
        padding: '20px',
        transition: 'all 0.3s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(220,38,38,0.3)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(220,38,38,0.12)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
        background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(185,28,28,0.3))',
            border: '1px solid rgba(220,38,38,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '16px', color: '#fca5a5',
          }}>
            {donor.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {donor.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={status.className} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <StatusIcon size={10} />
                {status.label}
              </span>
            </div>
          </div>
        </div>
        <div className="blood-badge">{donor.bloodGroup}</div>
      </div>

      {/* Info grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <InfoRow icon={BookOpen} text={`${donor.department} · ${donor.year}`} />
        <InfoRow icon={MapPin} text={donor.hostel} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={13} color={donor.availability ? 'var(--success)' : 'var(--text-muted)'} />
          <span style={{ fontSize: '13px', color: donor.availability ? 'var(--success)' : 'var(--text-muted)' }}>
            <span className={`avail-dot ${donor.availability ? 'available' : 'unavailable'}`} />
            {donor.availability ? 'Available to donate' : 'Currently unavailable'}
          </span>
        </div>
      </div>

      {/* Contact button — only logged in users, only verified donors */}
      {user && donor.status === 'verified' && (
        <button
          onClick={() => onContact?.(donor)}
          className="btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: '13px' }}
        >
          <Phone size={14} />
          Contact Donor
        </button>
      )}
      {!user && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '8px' }}>
          Login to view contact details
        </p>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, text }: { icon: React.ComponentType<{ size: number; color?: string }>, text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon size={13} color="var(--text-muted)" />
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{text}</span>
    </div>
  );
}
