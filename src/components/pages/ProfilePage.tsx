'use client';

import { useState, FormEvent, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useDonors } from '@/context/DonorContext';
import { BloodGroup, BLOOD_GROUPS, DEPARTMENTS, HOSTELS, YEARS } from '@/types';
import {
  User, Phone, Building, Calendar, MapPin, Heart, Edit3,
  Save, X, CheckCircle, Clock, XCircle, Droplets, AlertCircle,
  UserPlus, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { myDonorProfile, registerDonor, updateMyProfile, deleteMyProfile, fetchMyProfile } = useDonors();
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    bloodGroup: '' as BloodGroup | '',
    department: '',
    year: '',
    phone: '',
    hostel: '',
    availability: true,
  });

  const [editForm, setEditForm] = useState({
    phone: '',
    hostel: '',
    availability: true,
  });

  // Pre-fill edit form when profile loads
  useEffect(() => {
    if (myDonorProfile) {
      setEditForm({
        phone: myDonorProfile.phone ?? '',
        hostel: myDonorProfile.hostel,
        availability: myDonorProfile.availability,
      });
    }
  }, [myDonorProfile]);

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

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.bloodGroup) return;
    setSubmitting(true);
    setError('');
    const result = await registerDonor({
      bloodGroup: form.bloodGroup,
      department: form.department,
      year: form.year,
      phone: form.phone,
      hostel: form.hostel,
      availability: form.availability,
    });
    setSubmitting(false);
    if (result.success) {
      setIsRegistering(false);
      setSuccess('Donor profile submitted for admin verification!');
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(result.error ?? 'Registration failed.');
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!myDonorProfile) return;
    setSubmitting(true);
    setError('');
    const result = await updateMyProfile(myDonorProfile.id, editForm);
    setSubmitting(false);
    if (result.success) {
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(result.error ?? 'Update failed.');
    }
  };

  const statusIcon = myDonorProfile
    ? { VERIFIED: <CheckCircle size={16} color="var(--success)" />, PENDING: <Clock size={16} color="var(--warning)" />, REJECTED: <XCircle size={16} color="var(--danger)" /> }[myDonorProfile.status]
    : null;

  const statusLabel = myDonorProfile
    ? { VERIFIED: 'Verified', PENDING: 'Pending', REJECTED: 'Rejected' }[myDonorProfile.status]
    : '';

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

        {error && (
          <div style={{
            background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', padding: '14px 18px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)', fontSize: '14px',
          }}>
            <AlertCircle size={18} /> {error}
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
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '18px' }}>{user.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user.email}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', marginTop: '4px',
                ...(user.role === 'ADMIN'
                  ? { color: '#6366f1', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '2px 10px' }
                  : { color: 'var(--text-muted)' })
              }}>
                {user.role === 'ADMIN' ? '⚡ Administrator' : '👤 Student'}
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
            {user.role === 'ADMIN' && (
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '9px 16px', fontSize: '13px' }}>Admin Dashboard</button>
              </Link>
            )}
          </div>
        </div>

        {/* Donor profile section — view */}
        {myDonorProfile && !isRegistering && !isEditing && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Donor Registration</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  {statusIcon}
                  <span className={`status-${myDonorProfile.status.toLowerCase()}`}>{statusLabel}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="blood-badge" style={{ fontSize: '18px', padding: '8px 16px' }}>{myDonorProfile.bloodGroup}</div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary"
                  style={{ padding: '7px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>
            </div>

            {myDonorProfile.status === 'PENDING' && (
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
                { icon: Building, label: 'Department', value: myDonorProfile.department },
                { icon: Calendar, label: 'Year', value: myDonorProfile.year },
                { icon: Phone, label: 'Phone', value: myDonorProfile.phone ?? '—' },
                { icon: MapPin, label: 'Hostel / Area', value: myDonorProfile.hostel },
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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Availability</span>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: myDonorProfile.availability ? 'var(--success)' : 'var(--text-muted)' }}>
                  {myDonorProfile.availability ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit form */}
        {isEditing && myDonorProfile && (
          <div className="glass-card animate-scale-in" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Edit Donor Profile</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Phone Number</label>
                  <input type="tel" className="input-base" placeholder="+91 98765 43210"
                    value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Hostel / Area</label>
                  <select className="input-base" value={editForm.hostel} onChange={e => setEditForm(f => ({ ...f, hostel: e.target.value }))}>
                    {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editForm.availability}
                      onChange={e => setEditForm(f => ({ ...f, availability: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: '#ef4444', cursor: 'pointer' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>I&apos;m currently available</span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }} disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '12px 20px' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* No profile yet */}
        {!myDonorProfile && !isRegistering && (
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
        )}

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
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Blood Group *</label>
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
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }} disabled={submitting}>
                  {submitting ? <Loader2 size={16} /> : <Save size={16} />}
                  {submitting ? 'Submitting...' : 'Submit for Review'}
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
