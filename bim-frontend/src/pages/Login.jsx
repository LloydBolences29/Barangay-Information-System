import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "../styles/Login.css";
import { useAuth } from "../utils/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const { loading, setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    username: "",
    password: "",
  });
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try {
      const response = await fetch(`${VITE_API_URL}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("Response:", payload);

      const res = await response.json();
      if (response.ok) {
        console.log("Login successful:", res);
        setPayload({ username: "", password: "" });
        setLoginError("");
        setLoginSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          setLoginSuccessMessage("");
          // Optionally, redirect the user
          setAuth({
            loading: false,
            isAuthenticated: true,
            user: res.user.role,
          });

          switch (res.user.role) {
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
            // Add more roles and their respective redirects as needed
            default:
              navigate("/");
              break;
          }
        }, 2500);
      } else {
        setLoginError(res.message);
        setTimeout(() => {
          setLoginError("");
        }, 2500);
      }
    } catch (error) {
      console.log("Error during login:", error);
      setLoginError(error.message || "An error occurred during login.");
      setTimeout(() => {
        setLoginError("");
      }, 5000);
    }
  };
  return (
    <div>
      <Container id="login-main-container">
        <div id="welcome-header-text">
          <h1>Welcome to Your Barangay Information System</h1>
        </div>
        <div
          id="login-container"
          className="d-flex justify-content-center align-items-center"
        >
          <div id="login-wrapper">
            {/* <div id="login-content" className="p-5"> */}
            <h2>Login</h2>
            <Form
              id="login-form"
              className="d-flex justify-content-center flex-column"
              onSubmit={handleOnSubmit}
            >
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={payload.username}
                  placeholder="Enter username"
                  onChange={(e) =>
                    setPayload({ ...payload, username: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type={showLoginPassword ? "text" : "password"}
                    value={payload.password}
                    placeholder="Password"
                    onChange={(e) =>
                      setPayload({ ...payload, password: e.target.value })
                    }
                    required
                  />
                  <span
                    variant="link"
                    size="sm"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? (
                      <FaEyeSlash color="black" />
                    ) : (
                      <FaEye color="black" />
                    )}
                  </span>
                </div>
              </Form.Group>
              {loginError && <p style={{ color: "red" }}>{loginError}</p>}
              {loginSuccessMessage && (
                <p style={{ color: "green" }}>{loginSuccessMessage}</p>
              )}
              <Button variant="outline-primary" type="submit">
                Login
              </Button>
            </Form>
          </div>
          {/* </div> */}
        </div>
      </Container>
    </div>
  );
};

export default Login;
