'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import DonorCard from '@/components/ui/DonorCard';
import ContactModal from '@/components/ui/ContactModal';
import { useAuth } from '@/context/AuthContext';
import { useDonors } from '@/context/DonorContext';
import { Donor, BloodGroup, BLOOD_GROUPS, DEPARTMENTS, HOSTELS, YEARS } from '@/types';
import { Search, SlidersHorizontal, X, AlertCircle, Droplets } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { donors, fetchDonors } = useDonors();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>(
    (searchParams.get('bloodGroup') as BloodGroup) || ''
  );
  const [department, setDepartment] = useState('');
  const [hostel, setHostel] = useState('');
  const [year, setYear] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [contactDonor, setContactDonor] = useState<Donor | null>(null);

  const filtered = donors.filter(d => {
    if (d.status !== 'VERIFIED') return false;
    if (bloodGroup && d.bloodGroup !== bloodGroup && d.bloodGroupDisplay !== bloodGroup) return false;
    if (department && d.department !== department) return false;
    if (hostel && d.hostel !== hostel) return false;
    if (year && d.year !== year) return false;
    if (availableOnly && !d.availability) return false;
    return true;
  });

  const hasFilters = bloodGroup || department || hostel || year || availableOnly;

  const clearFilters = () => {
    setBloodGroup('');
    setDepartment('');
    setHostel('');
    setYear('');
    setAvailableOnly(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            <span className="gradient-text">Find</span> a Blood Donor
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Search {donors.filter(d => d.status === 'VERIFIED').length} verified donors across campus
          </p>
        </div>

        {!user && (
          <div style={{
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px', padding: '16px 20px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#a5b4fc',
          }}>
            <AlertCircle size={18} />
            <span>
              <Link href="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              {' '}to view donor contact details and access all features.
            </span>
          </div>
        )}

        {/* Search bar + filter toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Droplets size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <select
              id="bloodGroupSearch"
              className="input-base"
              style={{ paddingLeft: '40px', appearance: 'none', cursor: 'pointer' }}
              value={bloodGroup}
              onChange={e => setBloodGroup(e.target.value as BloodGroup | '')}
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '12px 18px', gap: '8px' }}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && (
              <span style={{
                background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
                width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700,
              }}>
                {[bloodGroup, department, hostel, year, availableOnly].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary" style={{ padding: '12px 16px', gap: '6px', color: '#fca5a5' }}>
              <X size={15} />
              Clear
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="glass-card animate-scale-in" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Department</label>
                <select id="deptFilter" className="input-base" value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Hostel / Area</label>
                <select id="hostelFilter" className="input-base" value={hostel} onChange={e => setHostel(e.target.value)}>
                  <option value="">All Locations</option>
                  {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Year</label>
                <select id="yearFilter" className="input-base" value={year} onChange={e => setYear(e.target.value)}>
                  <option value="">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 0' }}>
                  <input
                    id="availableFilter"
                    type="checkbox"
                    checked={availableOnly}
                    onChange={e => setAvailableOnly(e.target.checked)}
                    style={{
                      width: '18px', height: '18px', accentColor: '#ef4444', cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Available only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{filtered.length}</span> donors found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No donors found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Try adjusting your search filters or post an emergency request.</p>
          </div>
        ) : (
          <div className="stagger-children" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {filtered.map(donor => (
              <DonorCard key={donor.id} donor={donor} onContact={setContactDonor} />
            ))}
          </div>
        )}
      </div>

      <ContactModal donor={contactDonor} onClose={() => setContactDonor(null)} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Droplets size={32} color="#ef4444" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
