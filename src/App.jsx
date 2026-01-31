// Main app component with Bootstrap layout and React Router
// Uses simple token check from localStorage for now (later use Context)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

function App() {
  
  // Check if user is logged in

  const token = localStorage.getItem('token');

  return (
    <Router>
    <div className="d-flex flex-column min-vh-100 bg-light">
        {/* Bootstrap Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold fs-4" href="/">Pro-Tasker</a>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {!token && (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" href="/login">Login</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/register">Register</a>
                    </li>
                  </>
                )}
                {token && (
                  <li className="nav-item">
                    <a className="nav-link" href="/dashboard">Dashboard</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content area */}
        <main className="container py-5 flex-grow-1">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={token ? <Navigate to="/dashboard" /> : <div className="text-center">Login Page – Coming in next file</div>} 
            />
            <Route 
              path="/register" 
              element={token ? <Navigate to="/dashboard" /> : <div className="text-center">Register Page – Coming in next file</div>} 
            />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={token ? <div className="text-center">Dashboard – Projects list (next files)</div> : <Navigate to="/login" />} 
            />
            <Route 
              path="/projects/:id" 
              element={token ? <div className="text-center">Project Detail – Tasks & Planner (later)</div> : <Navigate to="/login" />} 
            />

            {/* Root path redirect */}
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>

        {/* Simple footer */}
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">Pro-Tasker Capstone Project – 2026</p>
        </footer>
      </div>

    </Router>
  )
}

export default App
