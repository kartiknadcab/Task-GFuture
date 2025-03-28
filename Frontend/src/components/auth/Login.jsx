import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { LogIn, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { validateEmail } from "../../utils";
import { login } from "../../api/api";
import { setRefresh } from "../../redux/dataSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate("");
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const data = await login(formData);

      localStorage.setItem("token", data.data.token);
      setSuccess(true);

      navigate("/dashboard");
      dispatch(setRefresh({ refresh: true }));
    } catch (err) {
      console.error("Login error:", err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        className="shadow-lg border-0"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <LogIn size={50} className="text-primary mb-3" />
            <h2 className="fw-bold">Welcome Back</h2>
            <p className="text-muted">Log in to continue to Project Manager</p>
          </div>

          {apiError && <Alert variant="danger">{apiError}</Alert>}
          {success && (
            <Alert variant="success">Login successful! Redirecting...</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <Mail className="me-2 text-muted" size={20} />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                isInvalid={!!errors.email}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="d-flex align-items-center">
                <Lock className="me-2 text-muted" size={20} />
                Password
              </Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                isInvalid={!!errors.password}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                <Link to="/forgot-password" className="text-primary">
                  Forgot Password?
                </Link>
              </Form.Text>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary">
                Sign Up
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
