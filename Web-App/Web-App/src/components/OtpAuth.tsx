import { useState } from 'react';
import { Building, ShieldCheck, Mail } from 'lucide-react';
import '../styling/OtpAuth.css';

interface OtpAuthProps {
  onSuccess: () => void;
}

export default function OtpAuth({ onSuccess }: OtpAuthProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    // Simulate sending OTP to email (demo code is '123456')
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456' || otp.length === 6) {
      onSuccess();
    } else {
      setError('Invalid OTP code. Use "123456" for this demo.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Building style={{ width: '2.5rem', height: '2.5rem', color: '#000000' }} />
          </div>
          <h2 className="auth-title">BOOKaCRIB</h2>
          <p className="auth-subtitle">Botswana Guesthouse Discovery Access Portal</p>
        </div>

        {error && (
          <div style={{ fontSize: '0.75rem', color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ width: '1rem', height: '1rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  placeholder="e.g., user@botswana.bw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>
            <button type="submit" className="auth-btn">
              Send Verification Code
            </button>
          </form>
        ) : (
          <div>
            <div className="otp-sent-notice">
              <ShieldCheck style={{ width: '1rem', height: '1rem', display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              6-digit code sent to <b>{email}</b>.<br />
              <span style={{ fontSize: '10px', color: '#065f46' }}>(Demo code: enter <strong style={{ letterSpacing: '1px' }}>123456</strong>)</span>
            </div>

            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="input-group">
                <label className="input-label">Enter 6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="auth-input"
                  style={{ textAlign: 'center', letterSpacing: '0.25em', fontWeight: 'bold', fontSize: '1.25rem' }}
                />
              </div>
              <button type="submit" className="auth-btn">
                Verify & Enter Platform
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', marginTop: '0.5rem' }}
              >
                ← Back to email input
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}