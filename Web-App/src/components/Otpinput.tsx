import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface VerifyResult {
  success: boolean;
  message: string;
}

export default function OtpInput() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [status, setStatus] = useState<{ message: string; color: string }>({
    message: '',
    color: '#000000',
  });
  const [isError, setIsError] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const verifyCode = (code: string) => {
    setStatus({ message: 'Verifying...', color: '#000000' });

    setTimeout(() => {
      const result: VerifyResult =
        code === '123456'
          ? { success: true, message: 'Code verified ✓' }
          : { success: false, message: 'Incorrect code, try again' };

      setStatus({
        message: result.message,
        color: '#000000',
      });

      if (!result.success) {
        setIsError(true);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setIsError(false);
        setTimeout(() => {
          navigate('/dashboard');
        }, 400);
      }
    }, 600);
  };

  const handleInputChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setIsError(false);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join('');
    if (fullCode.length === otp.length && !newOtp.includes('')) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const rawText = e.clipboardData.getData('text') ?? '';
    const pastedDigits = rawText.replace(/[^0-9]/g, '').slice(0, otp.length);

    if (!pastedDigits) return;

    const newOtp = [...otp];
    pastedDigits.split('').forEach((char, i) => {
      newOtp[i] = char;
    });

    setOtp(newOtp);
    setIsError(false);

    const focusIndex = Math.min(pastedDigits.length, otp.length - 1);
    inputRefs.current[focusIndex]?.focus();

    const fullCode = newOtp.join('');
    if (fullCode.length === otp.length && !newOtp.includes('')) {
      verifyCode(fullCode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length === otp.length && !otp.includes('')) {
      verifyCode(fullCode);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setStatus({ message: 'A new code has been sent.', color: '#000000' });
    setIsError(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '36px 24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#000000',
            marginBottom: '12px',
            marginTop: 0,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Enter OTP
        </h2>

        <p
          style={{
            fontSize: '14px',
            color: '#000000',
            lineHeight: '1.5',
            marginBottom: '24px',
            marginTop: 0,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          We have sent a verification code to your
          <br />
          mobile number
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '24px',
              width: '100%',
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                required
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                style={{
                  width: '44px',
                  height: '48px',
                  backgroundColor: isError ? '#fef2f2' : '#e5e7eb',
                  border: isError ? '1.5px solid #ef4444' : '1.5px solid transparent',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000000',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            ))}
          </div>

          {status.message && (
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
                color: '#000000',
              }}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: '#cacace',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#000000',
              margin: 0,
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              color: '#000000',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}