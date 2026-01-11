import { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../styles/Login.css";
import { useAuth } from "../utils/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import barangayLogo from "../assets/BRGYLOGO.png";
// IMPORTANT: Replace this with your actual logo file
// import barangayLogo from "../assets/barangay-logo.png";

const Login = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  // --- NEW STATE FOR SPLASH SCREEN ---
  // Controls when the splash screen starts fading out
  const [splashFading, setSplashFading] = useState(false);

  // Controls when the splash screen is removed from the DOM entirely
  const [showSplash, setShowSplash] = useState(true);

  const [payload, setPayload] = useState({ username: "", password: "" });
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [barangayName, setBarangayName] = useState("");
  const [currentLogo, setCurrentLogo] = useState("");
  // --- TRANSITION EFFECT LOGIC ---

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${VITE_API_URL}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (response.ok) {
        setPayload({ username: "", password: "" });
        setLoginError("");
        setLoginSuccessMessage("Login successful! Redirecting...");

        console.log("Login successful:", res.user);

        setTimeout(() => {
          setLoginSuccessMessage("");
          setAuth({
            loading: false,
            isAuthenticated: true,
            user: res.user,
            is_first_logged_in: res.user.is_first_logged_in,
          });

          if (res.user.is_first_logged_in) {
            navigate("/change-password");
            return;
          }

          switch (res.user?.role) {
            case "admin":
              navigate("/admin");
              break;
            case "captain":
              navigate("/captain");
              break;
            case "secretary":
              navigate("/secretary");
              break;
            case "treasurer":
              navigate("/treasurer");
              break;
            default:
              navigate("/");
              break;
          }
        }, 2500);
      } else {
        setLoginError(res.message);
        setTimeout(() => setLoginError(""), 2500);
      }
    } catch (error) {
      setLoginError(error.message || "An error occurred during login.");
      setTimeout(() => setLoginError(""), 5000);
    }
  };

  //get the current barangay information
  const fetchBarangayInformation = async () => {
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/system-settings/get-settings`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBarangayName(data.brgyName || "Barangay 35");
        setCurrentLogo(
          data.brgyLogo
            ? `${VITE_API_URL}/uploads/${data.brgyLogo}`
            : barangayLogo
        );
      }
    } catch (error) {
      console.log("Error fetching barangay information:", error);
    }
  };

  useEffect(() => {
    fetchBarangayInformation();
    // 1. After 2 seconds, start fading out the logo
    const fadeTimer = setTimeout(() => {
      setSplashFading(true);
    }, 2000);

    // 2. After the fade animation (0.5s) finishes, remove the splash from DOM
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2000ms delay + 500ms transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  return (
    <div className="login-background">
      {/* --- SPLASH SCREEN OVERLAY --- */}
      {showSplash && (
        <div className={`splash-overlay ${splashFading ? "fade-out" : ""}`}>
          <div className="splash-content">
            <img
              src={currentLogo } // Use fetched logo, fallback to default import
              alt="Barangay Logo"
              className="splash-logo"
            />
            <h2 className="splash-text">
              {`Barangay ${barangayName} Information System ` ||
                "Barangay 35 Information System"}{" "}
            </h2>
          </div>
        </div>
      )}

      {/* --- MAIN LOGIN CONTENT --- */}
      {/* We add 'content-visible' class when splash starts fading to trigger entry animation */}
      <Container
        id="login-main-container"
        className={splashFading ? "content-visible" : "content-hidden"}
      >
        <div id="welcome-header-text" className="text-center">
          <h1>
            {`Barangay ${barangayName} Information System ` ||
              "Barangay 35 Information System"}
          </h1>
          <p className="subtitle">Secure Management Portal</p>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <div id="login-wrapper" className="login-card shadow-lg">
            <div className="login-card-header">
              <h2>Login</h2>
              <p>Please enter your credentials</p>
            </div>

            <Form id="login-form" onSubmit={handleOnSubmit}>
              <Form.Group className="mb-4" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  value={payload.username}
                  placeholder="Enter your username"
                  onChange={(e) =>
                    setPayload({ ...payload, username: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <div className="password-wrapper">
                  <Form.Control
                    className="custom-input"
                    type={showLoginPassword ? "text" : "password"}
                    value={payload.password}
                    placeholder="Enter your password"
                    onChange={(e) =>
                      setPayload({ ...payload, password: e.target.value })
                    }
                    required
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                  >
                    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              {loginError && (
                <div className="alert-message error">{loginError}</div>
              )}
              {loginSuccessMessage && (
                <div className="alert-message success">
                  {loginSuccessMessage}
                </div>
              )}

              <Button className="w-100 login-btn" type="submit">
                Sign In
              </Button>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
