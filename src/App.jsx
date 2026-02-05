/* eslint-disable react-hooks/set-state-in-effect */
// Main application file with routing, navbar, token protection, and dark mode toggle
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));


  // Dark mode state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system theme changes (optional)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Listen for token changes from other tabs/windows (login/logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Safety check on mount
    const currentToken = localStorage.getItem("token");
    if (currentToken !== token) {
      setToken(currentToken);
    }

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token]);

  // Logout handler – fixed and centralized
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    //window.location.href = "/login"; // Force reload navigate("/login", { replace: true });
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
       
        {/* Navbar – always show user name, collapse only nav items */}
<nav className="navbar navbar-expand-lg shadow-lg">
  <div className="container-fluid">
    {/* Brand + User name – always visible */}
    <div className="d-flex align-items-center gap-4">
      <Link className="navbar-brand fw-bold fs-4" to="/">
                Pro-Tasker
              </Link>

      {/* User name – always shown, even on mobile */}
      {token && (
        <span className="navbar-text fw-bold fs-5 text-white">
          {localStorage.getItem("userName") || "User"}'s Tasks
        </span>
      )}
    </div>

    {/* Hamburger toggle – only collapses the right-side links */}
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

    {/* Collapsible part – only links + logout */}
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto align-items-center">
        {token ? (
          <>
            {/* Dashboard link – only visible in collapsed menu on mobile */}
            <li className="nav-item d-lg-none">
              <Link className="nav-link active fw-semibold text-white" to="/dashboard">
                        Dashboard
                      </Link>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-danger btn-md px-4 py-2 fw-semibold text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-white" to="/login">
                        Login
                      </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-white" to="/register">
                        Register
                      </Link>
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
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" replace /> : <Login setToken={setToken} />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="/dashboard" replace /> : <Register />}
            />
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/projects/:id"
              element={token ? <ProjectDetail /> : <Navigate to="/login" replace />}
            />
            <Route
              path="*"
              element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">Pro-Tasker Capstone – 2026</p>
        </footer>

        {/* FANCY FLOATING THEME TOGGLE – bottom right */}
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          title="Toggle Dark / Light Mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </Router>
  );
}

export default App;