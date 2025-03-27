import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { validateEmail } from "../../utils";
import { login } from "../../api/api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      setApiError("");
      setSuccess(false);

      const { user, token } = await login(formData);

      // Show success feedback
      setSuccess(true);

      // Small delay to show success message
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          {success && (
            <Alert variant="success">Login successful! Redirecting...</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
