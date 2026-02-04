// Sends POST to backend /api/auth/register
// Saves token and redirects on success

import { useState } from "react";
import { useNavigate } from "react-router-dom";
console.log("REGISTER COMPONENT STARTED – THIS SHOULD APPEAR IN CONSOLE");
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("=== REGISTER DEBUG START ===");
      console.log("1. Form data:", { firstName, lastName, email });

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;
      console.log("2. Sending to URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      console.log("3. Response status:", response.status);
      console.log("4. Response headers:", [...response.headers.entries()]);

      // Read as raw text first 
      const rawText = await response.text();
      console.log("5. Raw response body:", rawText || "[EMPTY BODY]");

      let data;
      try {
        data = JSON.parse(rawText);
        console.log("6. Parsed data:", data);
      } catch (parseErr) {
        console.error("JSON parse failed:", parseErr);
        throw new Error(`Invalid JSON from server: ${rawText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Registration failed (${response.status})`);
      }

      console.log("7. Success - token:", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user?.firstName || firstName);

      console.log("8. Redirecting to /dashboard");
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("=== REGISTER ERROR ===", err.message);
      setError(err.message || "Registration failed. Check console for details.");
    } finally {
      setLoading(false);
      console.log("=== REGISTER DEBUG END ===");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card card shadow-lg border-0 rounded-4">
        <div className="card-body p-5 p-md-5">
          <h2 className="text-center mb-5 fw-bold" style={{ color: "var(--primary)" }}>
            Register
          </h2>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="form-label fw-semibold">
                First Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                id="firstName"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="form-label fw-semibold">
                Last Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address
              </label>
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
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
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
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
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