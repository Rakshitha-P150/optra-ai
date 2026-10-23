import { useState, useEffect  } from "react";
import "./Auth.css";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [resetToken, setResetToken] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(
  localStorage.getItem("optraRememberMe") === "true"
    ? localStorage.getItem("optraRememberedEmail") || ""
    : ""
);
  const [rememberMe, setRememberMe] = useState(
  localStorage.getItem("optraRememberMe") === "true"
);

const [savedEmail, setSavedEmail] = useState(
  localStorage.getItem("optraRememberedEmail") || ""
);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  


  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }

     const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!strongPassword.test(password)) {
  alert(
    "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
  );
  return;
}

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: name.trim(),
              email: email.trim(),
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Registration failed. Please try again.");
          return;
        }

        setError("");
        alert("Account created successfully! You can now sign in once login authentication is connected.");
        changeMode("login");
      } catch (err) {
        setError(
          "Cannot connect to the server. Make sure Spring Boot is running on port 8080."
        );
      }

      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

   
try {
  const response = await fetch(
    "http://localhost:8080/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(data.message || "Invalid email or password.");
    return;
  }

  if (rememberMe) {
  localStorage.setItem("optraRememberMe", "true");
  localStorage.setItem("optraRememberedEmail", email.trim());
} else {
  localStorage.removeItem("optraRememberMe");
  localStorage.removeItem("optraRememberedEmail");
}

onLogin(data);
} catch (err) {
  setError(
    "Cannot connect to the server. Make sure Spring Boot is running."
  );
}

  }


  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="auth-brand">
          <span className="auth-logo">O</span>
          <span>OPTRA <strong>AI</strong></span>
        </div>

        <div className="auth-pitch">
          <span className="auth-eyebrow">INTELLIGENT LEAD MANAGEMENT</span>
          <h1>Turn missed follow-ups into meaningful opportunities.</h1>
          <p>
            Keep your leads organized, identify opportunities, and help your
            team focus on the customers who matter most.
          </p>

          <div className="auth-feature">
            <span>01</span>
            <div>
              <strong>One clear view</strong>
              <p>Manage your leads in one organized workspace.</p>
            </div>
          </div>

          <div className="auth-feature">
            <span>02</span>
            <div>
              <strong>Smarter follow-ups</strong>
              <p>Spot leads that may need your attention.</p>
            </div>
          </div>
        </div>

        <p className="auth-footer">OPTRA AI · Lead Recovery System</p>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <span className="auth-logo">O</span>
            <span>OPTRA <strong>AI</strong></span>
          </div>

          <span className="auth-eyebrow">
            {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
          </span>

          <h2>
            {mode === "login" ? "Sign in to your workspace" : "Create your account"}
          </h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Enter your details to continue to OPTRA AI."
              : "Set up your account to get started with OPTRA AI."}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => changeMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => changeMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="auth-field">
                Full name
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </label>
            )}

            <label className="auth-field">
              Email address
             <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            </label>
           
            

            <label className="auth-field">
              Password
              <span className="auth-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                
<button
  type="button"
  className="auth-show-password"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Hide password" : "Show password"}
  title={showPassword ? "Hide password" : "Show password"}
>
  {showPassword ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.8 4.7 9.5 6-.3.6-1.5 2.3-3.5 3.8M6.2 6.2C3.9 7.7 2.7 9.9 2.5 11c.7 1.3 4.3 6 9.5 6 1 0 1.9-.2 2.8-.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )}
</button>

              </span>
            </label>
             {mode === "login" && (
  <div className="auth-options">
    <label className="auth-remember">
      <input
        type="checkbox"
        checked={rememberMe}
        onChange={(event) => setRememberMe(event.target.checked)}
      />
      <span>Remember me</span>
    </label>

    <button
      type="button"
      className="auth-forgot"
   onClick={async () => {
  setError("");
  setSuccess("");
  setResetToken("");
  setMode("forgot");  

  if (!email.trim()) {
    setError("Please enter your email address first.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await response.json();
    console.log("Reset response:", response.status, data);

    if (!response.ok) {
      setError(data.message || "Unable to request password reset.");
      return;
    }

    setSuccess(
      `Reset token: ${data.token}. It expires in 15 minutes.`
    );
  } catch {
                      setError("Cannot connect to the backend. Please check that it is running.");
  }
}}
    >
      Forgot password?
    </button>
  </div>
)}

            {mode === "signup" && (
              <label className="auth-field">
                Confirm password
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                  required
                />
              </label>
            )}

            {error && <p className="auth-error" role="alert">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <button className="auth-submit" type="submit">
              {mode === "login" ? "Sign in to OPTRA AI" : "Create account"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? "New to OPTRA AI?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => changeMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <p className="auth-security">
            Your workspace access will be secured through backend authentication.
          </p>
        </div>
      </section>
    </main>
  );
}
