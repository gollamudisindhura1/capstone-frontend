// Sends POST to backend /api/auth/register
// Saves token and redirects on success

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
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
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
     
      <div className="auth-card card shadow-lg border-0 rounded-4">
        <div className="card-body p-5 p-md-5">
         
          <h2 className="text-center mb-5 fw-bold" style={{ color: 'var(--primary)' }}>
            Register
          </h2>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              {error}
             
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-semibold">Email address</label>
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                id="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

          
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

        
          <p className="text-center mt-4 mb-0">
            Already have an account?{' '}
            <a href="/login" className="text-primary fw-bold text-decoration-none">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;