import React, { useState, Suspense, lazy } from "react";
import { useNavigate } from 'react-router-dom';

// Lazy load heavy components (example - if you had any)
// const HeavyComponent = lazy(() => import('./HeavyComponent'));

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch("http://localhost:3333/api/checkingOTP/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Password reset instructions sent to your email.");
        localStorage.setItem("resetingPass", email);
        localStorage.setItem("emailSent", "true"); // local storage me ek flag set kiya
        setTimeout(() => navigate('/otp'), 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to send password reset instructions.");
      }
    } catch (err) {
      setError(err.name === 'AbortError' 
        ? "Request timed out. Please try again." 
        : "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div style={{
      maxWidth: "320px",
      margin: "40px auto",
      padding: "20px",
      textAlign: "center"
    }}>Loading...</div>}>
      <div style={{
        maxWidth: "320px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Forgot Password?</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "8px", color: "#555" }}>
            Enter your registered email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
            required
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isLoading ? "#ff8633" : "#ff8633",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease"
            }}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </Suspense>
  );
};

export default React.memo(ForgetPassword);