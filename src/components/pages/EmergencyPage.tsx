'use client';

import { useState, useEffect, FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useDonors } from '@/context/DonorContext';
import { BloodGroup, BLOOD_GROUPS, EmergencyRequest } from '@/types';
import {
  AlertCircle, Send, Clock, CheckCircle, XCircle, Droplets, Lock
} from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
  OPEN: { label: 'Open', icon: Clock, color: 'var(--warning)', bg: 'var(--warning-soft)', border: 'rgba(245,158,11,0.2)' },
  FULFILLED: { label: 'Fulfilled', icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-soft)', border: 'rgba(16,185,129,0.2)' },
  CLOSED: { label: 'Closed', icon: XCircle, color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.03)', border: 'var(--border-subtle)' },
};

export default function EmergencyPage() {
  const { user } = useAuth();
  const { emergencyRequests, addEmergencyRequest, fetchEmergencies } = useDonors();
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchEmergencies(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !bloodGroup) return;
    setLoading(true);
    setError('');
    const result = await addEmergencyRequest(bloodGroup, message || undefined);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setBloodGroup('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setError(result.error ?? 'Failed to post request.');
    }
  };

  const openRequests = emergencyRequests.filter(r => r.status === 'OPEN');
  const otherRequests = emergencyRequests.filter(r => r.status !== 'OPEN');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertCircle size={20} color="#ef4444" />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Emergency <span className="gradient-text">Blood Requests</span></h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginLeft: '52px' }}>
            Post urgent requests and reach all available campus donors
          </p>
        </div>

        {/* Post request form */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', borderColor: 'rgba(220,38,38,0.15)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Post Emergency Request</h2>

          {!user ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)' }}>
              <Lock size={28} style={{ margin: '0 auto 12px', display: 'block', color: 'var(--text-muted)' }} />
              <p style={{ marginBottom: '16px', fontSize: '14px' }}>You must be logged in to post emergency requests.</p>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '10px 24px' }}>Sign In</button>
              </Link>
            </div>
          ) : submitted ? (
            <div style={{
              background: 'var(--success-soft)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '10px', padding: '20px', textAlign: 'center',
            }}>
              <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '4px' }}>Request posted successfully!</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>All available donors will be notified shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Blood Group Needed *
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                        background: bloodGroup === bg ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.08)',
                        border: bloodGroup === bg ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(220,38,38,0.2)',
                        color: bloodGroup === bg ? '#fca5a5' : 'rgba(252,165,165,0.7)',
                        transform: bloodGroup === bg ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Message / Details
                </label>
                <textarea
                  id="emergencyMessage"
                  className="input-base"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="e.g. Need O+ urgently for patient at campus medical center. Please contact immediately."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '13px', maxWidth: '240px' }}
                disabled={!bloodGroup || loading}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Posting...
                  </span>
                ) : (
                  <><Send size={16} /> Post Emergency Request</>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Active requests */}
        {openRequests.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Active Requests ({openRequests.length})</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {openRequests.map(req => <RequestCard key={req.id} req={req} />)}
            </div>
          </section>
        )}

        {/* Past requests */}
        {otherRequests.length > 0 && (
          <section>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)' }}>Past Requests</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {otherRequests.map(req => <RequestCard key={req.id} req={req} />)}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}

function RequestCard({ req }: { req: EmergencyRequest }) {
  const cfg = statusConfig[req.status as keyof typeof statusConfig] ?? statusConfig.OPEN;
  const Icon = cfg.icon;
  const name = req.requesterName || req.requester?.name || 'Anonymous';
  const date = new Date(req.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="blood-badge">{req.bloodGroupDisplay ?? req.bloodGroup}</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px' }}>{name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{date}</p>
          </div>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px',
          borderRadius: '20px', fontSize: '12px', fontWeight: 600,
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        }}>
          <Icon size={12} /> {cfg.label}
        </span>
      </div>
      {req.message && (
        <p style={{
          fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
          background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '10px 14px',
          borderLeft: '2px solid rgba(220,38,38,0.3)',
        }}>
          {req.message}
        </p>
      )}
    </div>
  );
}

