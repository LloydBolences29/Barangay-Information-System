import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import '../styles/Login.css'

const Login = () => {

    const handleOnSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        window.alert("Login form submitted");
    }
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
          <div
            id="login-wrapper"
          >
            {/* <div id="login-content" className="p-5"> */}
              <h2>Login</h2>
              <Form id="login-form" className="d-flex justify-content-center flex-column" onSubmit={handleOnSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" required/>
                </Form.Group>
                <Button variant="outline-primary" type="submit">Login</Button>
              </Form>
            </div>
          {/* </div> */}
        </div>
      </Container>
    </div>
  );
};

export default Login;
