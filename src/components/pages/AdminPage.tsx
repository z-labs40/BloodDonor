'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useDonors } from '@/context/DonorContext';
import { Donor, BLOOD_GROUPS } from '@/types';
import {
  ShieldCheck, Users, CheckCircle, Clock, XCircle, Trash2,
  BarChart3, AlertCircle, TrendingUp, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

type Tab = 'overview' | 'donors' | 'requests';

export default function AdminPage() {
  const { user } = useAuth();
  const {
    adminDonors, adminStats, emergencyRequests,
    fetchAdminDonors, fetchAdminStats, fetchEmergencies,
    updateDonorStatus, removeDonor, updateRequestStatus,
  } = useDonors();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('all');
  const router = useRouter();

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.replace('/admin/login');
    }
  }, [user, router]);

  // Load admin data on mount
  useEffect(() => {
    fetchAdminDonors();
    fetchAdminStats();
    fetchEmergencies();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid rgba(220,38,38,0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }


  // Stats from API or compute from adminDonors as fallback
  const totalDonors      = adminStats?.totalDonors      ?? adminDonors.length;
  const verifiedDonors   = adminStats?.verifiedDonors   ?? adminDonors.filter(d => d.status === 'VERIFIED').length;
  const pendingDonors    = adminStats?.pendingDonors    ?? adminDonors.filter(d => d.status === 'PENDING').length;
  const availableDonors  = adminStats?.availableDonors  ?? adminDonors.filter(d => d.status === 'VERIFIED' && d.availability).length;
  const openRequests     = adminStats?.openEmergencies  ?? emergencyRequests.filter(r => r.status === 'OPEN').length;

  // Blood group chart data — prefer API stats, fallback to computing from adminDonors
  const bloodGroupData = adminStats?.donorsByBloodGroup
    ? Object.entries(adminStats.donorsByBloodGroup).map(([group, count]) => ({ group, count }))
    : BLOOD_GROUPS.map(bg => ({
        group: bg,
        count: adminDonors.filter(d => d.bloodGroup === bg && d.status === 'VERIFIED').length,
      }));

  const filteredDonors = filter === 'all' ? adminDonors : adminDonors.filter(d => d.status === filter);

  const CHART_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'donors', label: `Donors (${totalDonors})`, icon: <Users size={16} /> },
    { id: 'requests', label: `Requests (${emergencyRequests.length})`, icon: <AlertCircle size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <ShieldCheck size={22} color="#ef4444" />
              <h1 style={{ fontSize: '26px', fontWeight: 700 }}>Admin Dashboard</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Welcome back, {user.name}</p>
          </div>
          {pendingDonors > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--warning-soft)', border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '10px', padding: '10px 16px', fontSize: '13px', color: 'var(--warning)',
            }}>
              <Clock size={16} />
              {pendingDonors} donor{pendingDonors > 1 ? 's' : ''} awaiting verification
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '9px', border: 'none',
                fontFamily: 'inherit', fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab.id ? 'rgba(220,38,38,0.15)' : 'transparent',
                color: activeTab === tab.id ? '#fca5a5' : 'var(--text-secondary)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="animate-fade-up">
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Total Donors', value: totalDonors, icon: Users, color: '#6366f1' },
                { label: 'Verified', value: verifiedDonors, icon: CheckCircle, color: '#10b981' },
                { label: 'Pending Review', value: pendingDonors, icon: Clock, color: '#f59e0b' },
                { label: 'Available Now', value: availableDonors, icon: Activity, color: '#ef4444' },
                { label: 'Open Emergencies', value: openRequests, icon: AlertCircle, color: '#f97316' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', marginBottom: '12px',
                    background: `${color}15`, border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={color} />
                  </div>
                  <p style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Blood group chart */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <TrendingUp size={18} color="#ef4444" />
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Verified Donors by Blood Group</h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={bloodGroupData} barSize={32}>
                  <XAxis dataKey="group" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#131320', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {bloodGroupData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <div className="animate-fade-up">
            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {(['all', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '7px 16px', borderRadius: '8px', border: '1px solid',
                    fontFamily: 'inherit', fontSize: '13px', fontWeight: filter === f ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: filter === f ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.03)',
                    borderColor: filter === f ? 'rgba(220,38,38,0.4)' : 'rgba(255,255,255,0.08)',
                    color: filter === f ? '#fca5a5' : 'var(--text-secondary)',
                  }}
                >
                  {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                  {' '}({f === 'all' ? adminDonors.length : adminDonors.filter(d => d.status === f).length})
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredDonors.map(donor => (
                <AdminDonorRow key={donor.id} donor={donor}
                  onVerify={() => updateDonorStatus(donor.id, 'VERIFIED')}
                  onReject={() => updateDonorStatus(donor.id, 'REJECTED')}
                  onRemove={() => removeDonor(donor.id)}
                />
              ))}
              {filteredDonors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No donors found</div>
              )}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {emergencyRequests.map(req => (
              <div key={req.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="blood-badge">{req.bloodGroupDisplay ?? req.bloodGroup}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '14px' }}>{req.requesterName || req.requester?.name || 'Unknown'}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(req.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {req.status === 'OPEN' && (
                      <>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'FULFILLED')}
                          style={{ padding: '7px 14px', background: 'var(--success-soft)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '7px', color: 'var(--success)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <CheckCircle size={13} /> Mark Fulfilled
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'CLOSED')}
                          style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '7px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Close
                        </button>
                      </>
                    )}
                    <span style={{
                      padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                      background: req.status === 'OPEN' ? 'var(--warning-soft)' : req.status === 'FULFILLED' ? 'var(--success-soft)' : 'rgba(255,255,255,0.04)',
                      color: req.status === 'OPEN' ? 'var(--warning)' : req.status === 'FULFILLED' ? 'var(--success)' : 'var(--text-muted)',
                      border: `1px solid ${req.status === 'OPEN' ? 'rgba(245,158,11,0.2)' : req.status === 'FULFILLED' ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'}`,
                    }}>
                      {req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
                {req.message && (
                  <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '2px solid rgba(220,38,38,0.3)', paddingLeft: '12px' }}>
                    {req.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDonorRow({
  donor, onVerify, onReject, onRemove
}: {
  donor: Donor;
  onVerify: () => void;
  onReject: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, color: '#fca5a5', fontSize: '15px',
        }}>
          {(donor.user?.name ?? '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ fontWeight: 600, fontSize: '14px' }}>{donor.user?.name ?? 'Unknown'}</p>
            <span className="blood-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>{donor.bloodGroupDisplay ?? donor.bloodGroup}</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {donor.department} · {donor.year} · {donor.hostel}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span className={`status-${donor.status.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {donor.status === 'VERIFIED' && <CheckCircle size={10} />}
          {donor.status === 'PENDING' && <Clock size={10} />}
          {donor.status === 'REJECTED' && <XCircle size={10} />}
          {donor.status.charAt(0) + donor.status.slice(1).toLowerCase()}
        </span>

        {donor.status !== 'VERIFIED' && (
          <button onClick={onVerify} style={{
            padding: '6px 12px', background: 'var(--success-soft)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '6px', color: 'var(--success)', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <CheckCircle size={12} /> Verify
          </button>
        )}
        {donor.status !== 'REJECTED' && (
          <button onClick={onReject} style={{
            padding: '6px 12px', background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '6px', color: 'var(--danger)', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <XCircle size={12} /> Reject
          </button>
        )}
        <button onClick={onRemove} style={{
          padding: '6px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
          borderRadius: '6px', color: 'var(--text-muted)', fontSize: '12px',
          cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center',
        }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
