import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../styles/Login.css";
import { useAuth } from "../utils/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const { loading, setAuth } = useAuth();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    username: "",
    password: "",
  });

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

      if (response.ok) {
        const res = await response.json();
        console.log("Login successful:", res);
        setPayload({ username: "", password: "" });

        // Optionally, redirect the user
        setAuth({
          loading: false,
          isAuthenticated: true,
          user: res.data.user,
        });

        switch (res.data.user.role) {
          case "admin":
            navigate("/user-management");
            break;
          // Add more roles and their respective redirects as needed
          default:
            navigate("/");
            break;
        }
      }
    } catch (error) {
      console.log("Error during login:", error);
    }
  };
  return (
    <div>
      <Container id="login-main-container">
        <div id="welcome-header-text">
          <h1>Welcome to Barangay Information Management System</h1>
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
                <Form.Control
                  type="password"
                  value={payload.password}
                  placeholder="Password"
                  onChange={(e) =>
                    setPayload({ ...payload, password: e.target.value })
                  }
                  required
                />
              </Form.Group>
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
