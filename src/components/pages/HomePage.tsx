'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDonors } from '@/context/DonorContext';
import { useAuth } from '@/context/AuthContext';
import { BLOOD_GROUPS } from '@/types';
import Navbar from '@/components/layout/Navbar';
import DonorCard from '@/components/ui/DonorCard';
import ContactModal from '@/components/ui/ContactModal';
import { useState } from 'react';
import { Donor } from '@/types';
import {
  Droplets, Search, UserPlus, AlertCircle, ArrowRight,
  Users, Heart, ShieldCheck, Zap
} from 'lucide-react';

const STATS = [
  { label: 'Registered Donors', value: '120+', icon: Users, color: '#ef4444' },
  { label: 'Lives Saved', value: '48', icon: Heart, color: '#f97316' },
  { label: 'Verified Profiles', value: '95%', icon: ShieldCheck, color: '#10b981' },
  { label: 'Response Time', value: '<30min', icon: Zap, color: '#6366f1' },
];

export default function HomePage() {
  const { donors } = useDonors();
  const { user } = useAuth();
  const router = useRouter();
  const [contactDonor, setContactDonor] = useState<Donor | null>(null);

  const verifiedDonors = donors.filter(d => d.status === 'verified' && d.availability);
  const featuredDonors = verifiedDonors.slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: 'relative', padding: '80px 24px 60px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: '-10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '28px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '13px', color: '#fca5a5', fontWeight: 500 }}>Campus Emergency Network</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px',
          }}>
            Every Drop Counts.{' '}
            <span className="gradient-text">Find a Donor</span>{' '}
            Now.
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)',
            maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7,
          }}>
            BloodConnect links blood donors across your campus instantly.
            Search by blood group, filter by location, and save lives during emergencies.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }}>
                <Search size={18} />
                Find Blood Now
                <ArrowRight size={16} />
              </button>
            </Link>
            {!user ? (
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  <UserPlus size={18} />
                  Register as Donor
                </button>
              </Link>
            ) : (
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  <UserPlus size={18} />
                  My Donor Profile
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Blood group quick search */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Quick Search by Blood Group
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {BLOOD_GROUPS.map(bg => (
              <button
                key={bg}
                onClick={() => router.push(`/search?bloodGroup=${bg}`)}
                style={{
                  background: 'rgba(220,38,38,0.08)',
                  border: '1px solid rgba(220,38,38,0.25)',
                  color: '#fca5a5',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(220,38,38,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 24px 70px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {STATS.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 14px',
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available donors preview */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Available Donors</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Ready to help right now</p>
            </div>
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                View All <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          {featuredDonors.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No donors available right now.</p>
          ) : (
            <div className="stagger-children" style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px'
            }}>
              {featuredDonors.map(donor => (
                <DonorCard key={donor.id} donor={donor} onContact={setContactDonor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Emergency CTA */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(185,28,28,0.06))',
            border: '1px solid rgba(220,38,38,0.25)',
            borderRadius: '20px', padding: '40px', textAlign: 'center',
          }}>
            <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Need Blood Urgently?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
              Post an emergency request and notify all available donors on campus instantly.
            </p>
            <Link href="/emergency" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '14px 32px' }}>
                <AlertCircle size={16} />
                Post Emergency Request
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)', padding: '24px',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Droplets size={16} color="#ef4444" />
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>BloodConnect</span>
        </div>
        <p>Campus Blood Donor Directory · Built for emergencies · Protecting privacy</p>
      </footer>

      <ContactModal donor={contactDonor} onClose={() => setContactDonor(null)} />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
