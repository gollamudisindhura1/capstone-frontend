import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState} from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail'; 


function App() {
  const token = localStorage.getItem('token');
  const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('theme');
  return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
});
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        {/* Navbar - visible on all pages */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <li className="nav-item">
  <button
    className="btn btn-outline-light btn-sm ms-2"
    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
  >
    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
  </button>
</li>
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="/">Pro-Tasker</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {token ? (
  <>
    <li className="nav-item">
      <a className="nav-link active" href="/dashboard">Dashboard</a>
    </li>
    <li className="nav-item">
      <button 
        className="btn btn-outline-light btn-sm"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
      >
        Logout
      </button>
    </li>
  </>
) : (
  <>
    <li className="nav-item">
      <a className="nav-link" href="/login">Login</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/register">Register</a>
    </li>
  </>
)}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="container py-5 flex-grow-1">
          <Routes>
            <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/projects/:id" element={token ? <ProjectDetail /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">Pro-Tasker Capstone – 2026</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;