import React, { useState } from "react";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignIn) {
      console.log("Sign In Details:", { username, password });
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log("Sign Up Details:", { username, password });
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

        <button type="submit" style={styles.button}>
          {isSignIn ? "Sign In" : "Sign Up"}
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
  inputFocus: {
    borderColor: "#007bff",
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
  buttonHover: {
    backgroundColor: "#0056b3",
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
