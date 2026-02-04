// Sends POST to backend /api/auth/login
// Saves token to localStorage on success and redirects to dashboard

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('1. Attempting login with:', { email });

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('2. Response status:', response.status);

      const data = await response.json();
      console.log('3. Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('4. Saving token...');
      localStorage.setItem('token', data.token);

      // Update parent token state 
      if (setToken) {
        setToken(data.token);
        console.log('5. Parent token state updated');
      }

      // Save first name if returned
      if (data.user?.firstName) {
        localStorage.setItem('userName', data.user.firstName);
      }

      console.log('6. Redirecting to dashboard');
      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="card-body p-5 p-md-5">
          <h2 className="text-center mb-5 fw-bold" style={{ color: 'var(--primary)' }}>
            Login
          </h2>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Don't have an account?{' '}
            <a href="/register" className="text-primary fw-bold text-decoration-none">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;