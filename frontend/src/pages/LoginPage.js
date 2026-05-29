import React, { useState } from 'react';
import { authService } from '../services/authService';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #4ECDC4 0%, #38B2AC 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 36 }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', color: '#2C3E50', marginBottom: 8 }}>
          HRMS Portal
        </h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: 28, fontSize: '0.9rem' }}>
          Sign in to your HR dashboard
        </p>

        {error && <div style={{
          background: '#FED7D7', color: '#E74C3C', padding: '10px 14px',
          borderRadius: 8, fontSize: '0.85rem', marginBottom: 16
        }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control" type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control" type="password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#718096', fontSize: '0.82rem' }}>
          Demo: admin@hrms.com / emp@hrms.com (any password)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
