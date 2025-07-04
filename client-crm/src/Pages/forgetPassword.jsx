import React, { useState, Suspense, lazy } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { API_BASE_URL } from '../config/api'; 

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
    // Create a CancelToken source for timeout functionality
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel('Request timed out. Please try again.');
    }, 10000); // 10s timeout

    const response = await axios.post(
      `${API_BASE_URL}/api/checkingOTP/send`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
        cancelToken: source.token
      }
    );

    clearTimeout(timeoutId);

    // With axios, successful responses (2xx) come here automatically
    setMessage(response.data.message || "Password reset instructions sent to your email.");
    localStorage.setItem("resetingPass", email);
    localStorage.setItem("emailSent", "true");
    setTimeout(() => navigate('/otp'), 1500);

  }
 catch (err) {
    if (axios.isCancel(err)) {
      setError(err.message); // "Request timed out. Please try again."
    } else {
      // Handle other errors
      const errorMessage = err.response?.data?.message || 
                         "An error occurred. Please try again later.";
      setError(errorMessage);
    }
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