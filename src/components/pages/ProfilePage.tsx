'use client';

import { useState, FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useDonors } from '@/context/DonorContext';
import { BloodGroup, BLOOD_GROUPS, DEPARTMENTS, HOSTELS, YEARS } from '@/types';
import { Donor } from '@/types';
import {
  User, Phone, Building, Calendar, MapPin, Heart, Edit3,
  Save, X, CheckCircle, Clock, XCircle, Droplets, AlertCircle,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { donors, addDonor, getDonorByUserId } = useDonors();
  const router = useRouter();

  const existingDonor = user ? getDonorByUserId(user.id) : undefined;
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    bloodGroup: '' as BloodGroup | '',
    department: '',
    year: '',
    phone: '',
    hostel: '',
    availability: true,
  });

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '24px', gap: '16px' }}>
          <AlertCircle size={48} color="var(--text-muted)" />
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Sign in Required</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>You need to be logged in to view your profile.</p>
          <Link href="/login" style={{ textDecoration: 'none' }}><button className="btn-primary">Sign In</button></Link>
        </div>
      </div>
    );
  }

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.bloodGroup) return;
    addDonor({
      userId: user.id,
      name: user.name,
      bloodGroup: form.bloodGroup as BloodGroup,
      department: form.department,
      year: form.year,
      phone: form.phone,
      hostel: form.hostel,
      availability: form.availability,
    });
    setIsRegistering(false);
    setSuccess('Donor profile submitted for admin verification!');
    setTimeout(() => setSuccess(''), 4000);
  };

  const statusIcon = existingDonor
    ? { verified: <CheckCircle size={16} color="var(--success)" />, pending: <Clock size={16} color="var(--warning)" />, rejected: <XCircle size={16} color="var(--danger)" /> }[existingDonor.status]
    : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
          Manage your account and donor registration
        </p>

        {success && (
          <div style={{
            background: 'var(--success-soft)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '10px', padding: '14px 18px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success)', fontSize: '14px',
          }}>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        {/* Account info card */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(185,28,28,0.3))',
              border: '2px solid rgba(220,38,38,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 700, color: '#fca5a5',
            }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '18px' }}>{user.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user.email}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', marginTop: '4px',
                ...(user.role === 'admin'
                  ? { color: '#6366f1', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '2px 10px' }
                  : { color: 'var(--text-muted)' })
              }}>
                {user.role === 'admin' ? '⚡ Administrator' : '👤 Student'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="btn-secondary"
              style={{ padding: '9px 16px', fontSize: '13px', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              Sign Out
            </button>
            {user.role === 'admin' && (
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '9px 16px', fontSize: '13px' }}>Admin Dashboard</button>
              </Link>
            )}
          </div>
        </div>

        {/* Donor profile section */}
        {existingDonor && !isRegistering ? (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Donor Registration</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  {statusIcon}
                  <span className={`status-${existingDonor.status}`}>{existingDonor.status.charAt(0).toUpperCase() + existingDonor.status.slice(1)}</span>
                </div>
              </div>
              <div className="blood-badge" style={{ fontSize: '18px', padding: '8px 16px' }}>{existingDonor.bloodGroup}</div>
            </div>

            {existingDonor.status === 'pending' && (
              <div style={{
                background: 'var(--warning-soft)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '8px', padding: '12px 16px', marginBottom: '16px',
                fontSize: '13px', color: 'var(--warning)',
              }}>
                Your profile is pending admin verification. You&apos;ll appear in search once verified.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {[
                { icon: Building, label: 'Department', value: existingDonor.department },
                { icon: Calendar, label: 'Year', value: existingDonor.year },
                { icon: Phone, label: 'Phone', value: existingDonor.phone },
                { icon: MapPin, label: 'Hostel / Area', value: existingDonor.hostel },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Icon size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{value}</p>
                </div>
              ))}
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Heart size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: existingDonor.availability ? 'var(--success)' : 'var(--text-muted)' }}>
                  {existingDonor.availability ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
          </div>
        ) : !isRegistering ? (
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Droplets size={40} color="var(--crimson)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Register as a Donor</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px', lineHeight: 1.6 }}>
              Help save lives by registering as a blood donor. Your profile will be reviewed by admin before appearing in searches.
            </p>
            <button onClick={() => setIsRegistering(true)} className="btn-primary" style={{ padding: '12px 28px' }}>
              <UserPlus size={16} />
              Register as Donor
            </button>
          </div>
        ) : null}

        {/* Registration form */}
        {isRegistering && (
          <div className="glass-card animate-scale-in" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Donor Registration Form</h2>
              <button onClick={() => setIsRegistering(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Blood Group *
                  </label>
                  <select id="regBloodGroup" required className="input-base" value={form.bloodGroup}
                    onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value as BloodGroup }))}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Department *</label>
                  <select id="regDepartment" required className="input-base" value={form.department}
                    onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Year *</label>
                  <select id="regYear" required className="input-base" value={form.year}
                    onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Phone Number *</label>
                  <input id="regPhone" required type="tel" className="input-base" placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Hostel / Area *</label>
                  <select id="regHostel" required className="input-base" value={form.hostel}
                    onChange={e => setForm(f => ({ ...f, hostel: e.target.value }))}>
                    <option value="">Select location</option>
                    {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input id="regAvailability" type="checkbox" checked={form.availability}
                      onChange={e => setForm(f => ({ ...f, availability: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: '#ef4444', cursor: 'pointer' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>I&apos;m currently available to donate</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                  <Save size={16} />
                  Submit for Review
                </button>
                <button type="button" onClick={() => setIsRegistering(false)} className="btn-secondary" style={{ padding: '12px 20px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
