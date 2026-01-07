import { useEffect, useState } from "react";
import "../styles/ChangePassword.css";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  console.log("ChangePassword Auth:", auth);
  const [payload, setPayload] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (payload.newPassword !== payload.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: auth.user.id,
            newPassword: payload.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setTimeout(()=>{
            setSuccessMessage("");
        }, 3500)
        setErrorMessage("");
        setPayload({ newPassword: "", confirmPassword: "" });
        setIsSuccess(true);
        setAuth((prev)=>({
            ...prev, user: { ...prev.user, is_first_logged_in: 0 }
        }))
      }
    } catch (error) {
      console.log("Error changing password:", error);
      setErrorMessage(error.message);
      setTimeout(()=>{
        setErrorMessage("");
      }, 3500)
      setSuccessMessage("");
      setIsSuccess(false);
    }
  };

  console.log("Auth user role", auth.isAuthenticated);

  useEffect(() => {
    if (isSuccess && auth.isAuthenticated && !auth.user?.is_first_logged_in) {
      switch (auth.user?.role) {
        case "admin":
            setTimeout(() => {  
          navigate("/admin");
            })
          break;
        case "captain":
            setTimeout(() => {  
          navigate("/captain");
            })
          break;
        case "secretary":
            setTimeout(() => {
          navigate("/secretary");
            })
          break;
        case "treasurer":
            setTimeout(() => {
          navigate("/treasurer");
            })
          break;
        default:
          setTimeout(() => {
            navigate("/");
          }, 3700);
      }
    }
  }, [isSuccess, auth.isAuthenticated, auth.user?.is_first_logged_in]);

  if (!auth.isAuthenticated || !auth.user?.is_first_logged_in) {
        return <Navigate to="/" replace />;
  }
  return (
    <div className="change-password-container">
      <div className="change-password-wrapper">
        <h1 className="title">Change your password</h1>

        <div className="change-password-form">
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                onChange={(e) =>
                  setPayload({ ...payload, newPassword: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                onChange={(e) =>
                  setPayload({ ...payload, confirmPassword: e.target.value })
                }
                required
              />
            </Form.Group>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            <div className="change-password-button">
              <Button
                variant="outline-primary"
                className="getStartedButton"
                type="submit"
              >
                Change Password
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
   
  );
};

export default ChangePassword;
