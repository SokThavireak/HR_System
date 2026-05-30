import React, { useState } from 'react';
import { authService } from '../services/authService';
import Icon from '../components/common/Icons';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 16px',
    paddingLeft: field === 'email' || field === 'password' ? 44 : 16,
    border: `2px solid ${focusField === field ? '#7A6BFF' : '#E8EBF0'}`,
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 500,
    color: '#1E293B',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    outline: 'none',
    boxShadow: focusField === field ? '0 0 0 4px rgba(122,107,255,0.12)' : 'none',
    transition: 'all 0.2s',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login(email, password);
      localStorage.setItem('hrms_token', data.token);
      onLogin(data);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.container,
        ...(isMobile ? { flexDirection: 'column', height: 'auto' } : {}),
      }}>

        {/* ======== LEFT: Branding Section ======== */}
        <div style={{
          ...styles.brandingSection,
          ...(isMobile ? { padding: '3rem 2rem', minHeight: 350 } : {}),
        }}>
          <div style={styles.logoContainer}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="home" size={24} color="#7A6BFF" bold />
            </div>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Every Where Every Time<br />I'll Be Here For You</h1>
            <p style={styles.heroText}>
              See the analytics and grow your data remotely, from anywhere.
            </p>
            <div style={styles.heroLine} />
          </div>

          <div style={{ ...styles.uiMockup, display: isMobile ? 'none' : 'flex' }}>
            <div style={styles.mockupSidebar}>
              <div style={{ ...styles.mockupIcon, ...styles.mockupIconActive }} />
              <div style={styles.mockupIcon} />
              <div style={styles.mockupIcon} />
              <div style={styles.mockupIcon} />
            </div>
            <div style={styles.mockupContent}>
              <div style={styles.mockupHeader}>
                <div style={{ ...styles.mockupIcon, background: '#E2E8F0', width: 20, height: 20 }} />
                <div style={styles.mockupTitle} />
              </div>
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} style={styles.mockupRow}>
                  <div style={{ ...styles.mockupCell, ...styles.mockupCellSmall, background: i === 1 ? '#CBD5E1' : '#F1F5F9' }} />
                  <div style={{ ...styles.mockupCell, background: i === 1 ? '#CBD5E1' : '#F1F5F9' }} />
                  <div style={{ ...styles.mockupCell, background: i === 1 ? '#CBD5E1' : '#F1F5F9' }} />
                </div>
              ))}
            </div>
          </div>

          <img src="https://i.pravatar.cc/100?img=5" alt=""
            style={{ ...styles.avatar, top: '45%', right: '5%', display: isMobile ? 'none' : 'block' }} />
          <img src="https://i.pravatar.cc/100?img=11" alt=""
            style={{ ...styles.avatar, bottom: '10%', left: '20%', display: isMobile ? 'none' : 'block' }} />
        </div>

        {/* ======== RIGHT: Login Form ======== */}
        <div style={{
          ...styles.loginSection,
          ...(isMobile ? { padding: '3rem 2rem' } : {}),
        }}>
          <div style={styles.loginWrapper}>
            <h2 style={styles.loginHeading}>Login</h2>

            {error && <div style={styles.errorBanner}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Icon name="mail" size={18} color="#9AA3B5"
                    style={{ position: 'absolute', left: 14, top: 12 }} />
                  <input
                    type="email"
                    style={inputStyle('email')}
                    placeholder="your_name@mail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusField('email')}
                    onBlur={() => setFocusField(null)}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Icon name="eye" size={18} color="#9AA3B5"
                    style={{ position: 'absolute', left: 14, top: 12,
                      transform: showPassword ? 'none' : 'scaleX(1)',
                      opacity: 0.5,
                    }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    style={inputStyle('password')}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                  />
                  <button type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: 'absolute', right: 12, top: 10,
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: 4, display: 'flex',
                    }}
                  >
                    <Icon name={showPassword ? 'eye' : 'eyeOff'} size={18} color="#7A6BFF" />
                  </button>
                </div>
              </div>

              <div style={styles.checkboxGroup}>
                <input type="checkbox" id="remember" style={{ ...styles.checkbox, marginRight: '0.6rem' }} />
                <label htmlFor="remember" style={styles.checkboxLabel}>Remember Password</label>
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in…' : (
                  <><Icon name="login" size={18} color="#fff" bold /> Login</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const BLUE_BG  = 'linear-gradient(135deg,#7A6BFF 0%,#6556E0 100%)';
const WHITE    = '#fff';

const styles = {
  page: {
    backgroundColor: '#E8EAF6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: 1100,
    height: 700,
    background: WHITE,
    borderRadius: 20,
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', -apple-system, system-ui, sans-serif",
  },

  /* ---- Branding Left ---- */
  brandingSection: {
    flex: 1.1,
    background: BLUE_BG,
    position: 'relative',
    padding: '3.5rem',
    color: WHITE,
    overflow: 'hidden',
  },
  logoContainer: { position: 'relative', zIndex: 2, marginBottom: '6rem' },
  heroContent: { position: 'relative', zIndex: 2, maxWidth: 340 },
  heroTitle: { fontSize: '1.9rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2, color: WHITE },
  heroText: { fontSize: '1rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.5, margin: 0 },
  heroLine: { width: 36, height: 3, background: 'rgba(255,255,255,0.4)', marginTop: '1.5rem', borderRadius: 3 },

  /* UI Mockup */
  uiMockup: {
    position: 'absolute', bottom: -30, right: -60,
    width: 480, height: 320, background: WHITE,
    borderRadius: 16, boxShadow: '-15px 15px 40px rgba(0,0,0,0.15)',
    zIndex: 3, display: 'flex', overflow: 'hidden',
  },
  mockupSidebar: {
    width: 64, background: '#1E3A8A', padding: '1rem 0',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
  },
  mockupIcon: { width: 24, height: 24, background: 'rgba(255,255,255,0.2)', borderRadius: 6 },
  mockupIconActive: { background: WHITE, borderRadius: 8 },
  mockupContent: { flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 10 },
  mockupHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  mockupTitle: { width: 120, height: 16, background: '#E2E8F0', borderRadius: 4 },
  mockupRow: { display: 'flex', gap: 10 },
  mockupCell: { height: 22, background: '#F1F5F9', borderRadius: 4, flex: 1 },
  mockupCellSmall: { flex: 0.3 },

  avatar: {
    position: 'absolute', width: 44, height: 44,
    borderRadius: '50%', border: '3px solid #fff',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 4,
  },

  /* ---- Login Right ---- */
  loginSection: {
    flex: 0.9,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: '3rem',
    background: WHITE,
  },
  loginWrapper: { width: '100%', maxWidth: 380 },
  loginHeading: {
    fontSize: '1.9rem', color: '#1E293B',
    fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.02em',
  },

  errorBanner: {
    background: '#FEE2E2', color: '#DC2626',
    padding: '12px 16px', borderRadius: 10,
    fontSize: '0.95rem', fontWeight: 600, marginBottom: 18,
  },

  formGroup: { marginBottom: '1.6rem' },
  label: {
    display: 'block', fontSize: '0.92rem',
    fontWeight: 700, color: '#334155', marginBottom: '0.5rem',
  },

  checkboxGroup: { display: 'flex', alignItems: 'center', marginBottom: '2rem' },
  checkbox: { width: 18, height: 18, cursor: 'pointer' },
  checkboxLabel: { fontSize: '0.9rem', color: '#555E6D', cursor: 'pointer', fontWeight: 600 },

  submitBtn: {
    width: '100%', background: BLUE_BG, color: WHITE,
    border: 'none', padding: '14px', borderRadius: 12,
    fontSize: '1.05rem', fontWeight: 800,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'opacity 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
};

export default LoginPage;
