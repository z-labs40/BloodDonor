'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Droplets, Menu, X, Home, Search, UserPlus, LayoutDashboard, LogOut,
  AlertCircle, ShieldCheck, User
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Find Donors', icon: Search },
  { href: '/emergency', label: 'Emergency', icon: AlertCircle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 10, 15, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(220,38,38,0.4)',
            }}>
              <Droplets size={18} color="white" />
            </div>
            <span style={{
              fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              BloodConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '8px', textDecoration: 'none',
                  fontSize: '14px', fontWeight: active ? 600 : 400,
                  color: active ? '#ef4444' : 'var(--text-secondary)',
                  background: active ? 'rgba(239,68,68,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" style={{ textDecoration: 'none' }}>
                    <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}>
                      <ShieldCheck size={14} />
                      <span>Admin</span>
                    </button>
                  </Link>
                )}
                <Link href="/profile" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}>
                    <User size={14} />
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                </Link>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Login</button>
                </Link>
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <UserPlus size={14} />
                    Sign Up
                  </button>
                </Link>
              </>
            )}
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              className="mobile-only"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            padding: '12px 0 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '8px', textDecoration: 'none',
                color: pathname === href ? '#ef4444' : 'var(--text-secondary)',
                background: pathname === href ? 'rgba(239,68,68,0.08)' : 'transparent',
                fontSize: '15px', fontWeight: pathname === href ? 600 : 400,
              }}>
                <Icon size={17} />
                {label}
              </Link>
            ))}
            {user && (
              <Link href="/profile" onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '8px', textDecoration: 'none',
                color: 'var(--text-secondary)', fontSize: '15px',
              }}>
                <User size={17} /> My Profile
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '8px', textDecoration: 'none',
                color: 'var(--text-secondary)', fontSize: '15px',
              }}>
                <LayoutDashboard size={17} /> Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) { .mobile-only { display: none !important; } }
        @media (max-width: 767px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}
