import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Alert 
} from 'react-bootstrap';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils";
import { register } from "../../api/api";

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
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

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      setApiError("");
      setSuccess(false);

      const data = await register(formData);

      localStorage.setItem("token", data.data.token);
      setSuccess(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
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
            <UserPlus size={50} className="text-success mb-3" />
            <h2 className="fw-bold">Create an Account</h2>
            <p className="text-muted">Join Project Manager today</p>
          </div>

          {apiError && <Alert variant="danger">{apiError}</Alert>}
          {success && (
            <Alert variant="success">
              Registration successful! Redirecting...
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <User className="me-2 text-muted" size={20} />
                Full Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isInvalid={!!errors.name}
                required
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <Mail className="me-2 text-muted" size={20} />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                isInvalid={!!errors.email}
                required
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <Lock className="me-2 text-muted" size={20} />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                name="password"
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
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 py-2"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Log In
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
