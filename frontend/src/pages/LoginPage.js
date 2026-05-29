import React, { useState } from 'react';
import { authService } from '../services/authService';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.85rem 1rem',
    border: `1px solid ${focusField === field ? '#3A62F6' : '#E2E8F0'}`,
    borderRadius: 6,
    fontSize: '0.9rem',
    color: '#1A202C',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    outline: 'none',
    boxShadow: focusField === field ? '0 0 0 3px rgba(58, 98, 246, 0.1)' : 'none',
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
          {/* Logo */}
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon} />
          </div>

          {/* Hero Text */}
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Designed for Individuals</h1>
            <p style={styles.heroText}>
              See the analytics and grow your data remotely, from anywhere.
            </p>
            <div style={styles.heroLine} />
          </div>

          {/* Decorative UI Mockup */}
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
              <div style={{ ...styles.mockupRow, marginTop: 10 }}>
                <div style={{ ...styles.mockupCell, ...styles.mockupCellSmall, background: '#CBD5E1' }} />
                <div style={{ ...styles.mockupCell, background: '#CBD5E1' }} />
                <div style={{ ...styles.mockupCell, background: '#CBD5E1' }} />
              </div>
              <div style={styles.mockupRow}>
                <div style={{ ...styles.mockupCell, ...styles.mockupCellSmall }} />
                <div style={styles.mockupCell} />
                <div style={styles.mockupCell} />
              </div>
              <div style={styles.mockupRow}>
                <div style={{ ...styles.mockupCell, ...styles.mockupCellSmall }} />
                <div style={styles.mockupCell} />
                <div style={styles.mockupCell} />
              </div>
              <div style={styles.mockupRow}>
                <div style={{ ...styles.mockupCell, ...styles.mockupCellSmall }} />
                <div style={styles.mockupCell} />
                <div style={styles.mockupCell} />
              </div>
              <div style={styles.mockupRow}>
                <div style={{ ...styles.mockupCell, ...styles.mockupCellSmall }} />
                <div style={styles.mockupCell} />
                <div style={styles.mockupCell} />
              </div>
              <div style={styles.mockupRow}>
                <div style={{ ...styles.mockupCell, ...styles.mockupCellSmall }} />
                <div style={styles.mockupCell} />
                <div style={styles.mockupCell} />
              </div>
            </div>
          </div>

          {/* Floating Avatars */}
          <img
            src="https://i.pravatar.cc/100?img=5" alt="Avatar"
            style={{ ...styles.avatar, top: '45%', right: '5%', display: isMobile ? 'none' : 'block' }}
            className="avatar-1"
          />
          <img
            src="https://i.pravatar.cc/100?img=11" alt="Avatar"
            style={{ ...styles.avatar, bottom: '10%', left: '20%', display: isMobile ? 'none' : 'block' }}
            className="avatar-2"
          />
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
              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  style={inputStyle('email')}
                  placeholder="name@mail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                />
              </div>

              {/* Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  style={inputStyle('password')}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                />
              </div>

              {/* Remember Me */}
              <div style={styles.checkboxGroup}>
                <input type="checkbox" id="remember" style={{ ...styles.checkbox, marginRight: '0.5rem' }} />
                <label htmlFor="remember" style={styles.checkboxLabel}>Remember Password</label>
              </div>

              {/* Submit */}
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            {/* Footer */}
            <div style={styles.formFooter}>
              Don't have an account? <a href="#!" style={styles.footerLink}>Sign up</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ================================================
   Inline Styles (ported from HTML design)
   ================================================ */
const BLUE = '#3A62F6';
const BLUE_DARK = '#2041CD';

const styles = {
  page: {
    backgroundColor: '#E2E8F0',
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
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },

  /* ---- Branding Left ---- */
  brandingSection: {
    flex: 1.1,
    background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`,
    position: 'relative',
    padding: '3.5rem',
    color: '#fff',
    overflow: 'hidden',
  },

  logoContainer: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6rem',
  },
  logoIcon: {
    width: 24,
    height: 24,
    background: '#fff',
    borderRadius: 4,
    position: 'relative',
  },

  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 320,
  },
  heroTitle: {
    fontSize: '1.75rem',
    fontWeight: 600,
    marginBottom: '1rem',
    lineHeight: 1.2,
    color: '#fff',
  },
  heroText: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.5,
    margin: 0,
  },
  heroLine: {
    width: 30,
    height: 2,
    background: 'rgba(255,255,255,0.4)',
    marginTop: '1.5rem',
  },

  /* UI Mockup Card */
  uiMockup: {
    position: 'absolute',
    bottom: -30,
    right: -60,
    width: 480,
    height: 320,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '-15px 15px 40px rgba(0,0,0,0.15)',
    zIndex: 3,
    display: 'flex',
    overflow: 'hidden',
  },
  mockupSidebar: {
    width: 60,
    background: '#1E3A8A',
    padding: '1rem 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  mockupIcon: {
    width: 22,
    height: 22,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  mockupIconActive: {
    background: '#fff',
    borderRadius: 8,
  },
  mockupContent: {
    flex: 1,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  mockupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  mockupTitle: {
    width: 120,
    height: 16,
    background: '#E2E8F0',
    borderRadius: 4,
  },
  mockupRow: {
    display: 'flex',
    gap: 10,
  },
  mockupCell: {
    height: 20,
    background: '#F1F5F9',
    borderRadius: 4,
    flex: 1,
  },
  mockupCellSmall: {
    flex: 0.3,
  },

  /* Floating Avatars */
  avatar: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '3px solid #fff',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    zIndex: 4,
  },

  /* ---- Login Right ---- */
  loginSection: {
    flex: 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    background: '#fff',
  },
  loginWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  loginHeading: {
    fontSize: '1.75rem',
    color: '#1A202C',
    fontWeight: 600,
    marginBottom: '2.5rem',
  },

  /* Error */
  errorBanner: {
    background: '#FED7D7',
    color: '#E74C3C',
    padding: '10px 14px',
    borderRadius: 6,
    fontSize: '0.85rem',
    marginBottom: 16,
  },

  /* Form */
  formGroup: {
    marginBottom: '1.5rem',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#4A5568',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },

  /* Checkbox */
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  checkbox: {
    width: 16,
    height: 16,
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '0.85rem',
    color: '#4A5568',
    cursor: 'pointer',
    userSelect: 'none',
  },

  /* Submit */
  submitBtn: {
    width: '100%',
    background: BLUE,
    color: '#fff',
    border: 'none',
    padding: '0.9rem',
    borderRadius: 6,
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  },

  /* Footer */
  formFooter: {
    marginTop: '1.5rem',
    fontSize: '0.85rem',
    color: '#718096',
  },
  footerLink: {
    color: BLUE,
    textDecoration: 'none',
    fontWeight: 500,
  },
};

export default LoginPage;
