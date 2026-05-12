'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Droplets, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['#ef4444', '#f97316', '#10b981'];
  const strengthLabels = ['Weak', 'Fair', 'Strong'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.error ?? 'Signup failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '20%', right: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(220,38,38,0.4)',
            }}>
              <Droplets size={22} color="white" />
            </div>
            <span style={{
              fontWeight: 800, fontSize: '22px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>BloodConnect</span>
          </Link>
          <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Join the campus blood donor network</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '12px', marginBottom: '20px',
              fontSize: '13px', color: '#fca5a5',
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input id="fullname" type="text" className="input-base" style={{ paddingLeft: '40px' }}
                placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input id="signup-email" type="email" className="input-base" style={{ paddingLeft: '40px' }}
                placeholder="you@campus.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input id="signup-password" type={showPassword ? 'text' : 'password'} className="input-base"
                style={{ paddingLeft: '40px', paddingRight: '44px' }}
                placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength */}
            {password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3].map(level => (
                    <div key={level} style={{
                      height: '3px', flex: 1, borderRadius: '2px',
                      background: level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: passwordStrength > 0 ? strengthColors[passwordStrength - 1] : 'var(--text-muted)' }}>
                  {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : ''}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input id="confirm-password" type={showPassword ? 'text' : 'password'} className="input-base"
                style={{ paddingLeft: '40px', paddingRight: '44px', borderColor: confirmPassword && confirmPassword !== password ? 'rgba(239,68,68,0.5)' : '' }}
                placeholder="Repeat your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              {confirmPassword && confirmPassword === password && (
                <CheckCircle size={16} color="var(--success)" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px' }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Creating account...
              </span>
            ) : (
              <><span>Create Account</span> <ArrowRight size={16} /></>
            )}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
