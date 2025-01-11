import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // For error messages from backend
  const [isLoading, setIsLoading] = useState(false); // To show loading state

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignIn) {
      try {
        setIsLoading(true); 
        const response = await fetch("http://localhost:5000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.success) {
          // alert("Login successful!");
          navigate('/home', {state: {user: data}});
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.success) {
          // alert("Sign Up successful!");
          // console.log(data.user);
          navigate('/home', {state: {user: data}});
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("An error occurred during sign-up");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleForm = () => setIsSignIn(!isSignIn);

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>{isSignIn ? "Welcome Back!" : "Create an Account"}</h2>

        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Enter your username"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
            required
          />
        </div>

        {!isSignIn && (
          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Confirm your password"
              required
            />
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
        </button>

        <p style={styles.footer}>
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm} style={styles.link}>
            {isSignIn ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
    fontFamily: "'Roboto', sans-serif",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "26px",
    color: "#333333",
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555555",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    border: "1px solid #dcdcdc",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555555",
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
    textDecoration: "underline",
    cursor: "pointer",
    transition: "color 0.3s",
  },
};

export default Auth;
