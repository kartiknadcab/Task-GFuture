import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import {
  CheckCircle,
  Flag,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  ChevronLeft,
} from "lucide-react";
import { getTask } from "../api/api";
import { formatDate, getPriorityColor, getStatusColor } from "../utils";
import DashNav from "../components/DashNav";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await getTask(id);
        setTask(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading && !task) {
    return (
      <>

        <Container className="text-center mt-5">
          <div className="d-flex justify-content-center align-items-center flex-column">
            <AlertTriangle
              className="mb-3 text-primary animate-pulse"
              size={48}
            />
            <Spinner
              animation="border"
              variant="primary"
              className="mx-auto mb-3"
            />
            <p className="text-muted">Loading task details...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <AlertTriangle className="me-2" size={24} />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="d-flex align-items-center">
          <Info className="me-2" size={24} />
          Task not found
        </Alert>
      </Container>
    );
  }

  return (
    <>
    <DashNav />

    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <CheckCircle className="me-2 text-success" size={24} />
          {task.title}
        </h2>
        <Button
          as={Link}
          to={`/projects/${task.project._id}`}
          variant="outline-secondary"
          className="d-flex align-items-center"
        >
          <ChevronLeft className="me-1" size={20} />
          Back to Project
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Text className="mb-4">
            {task.description || "No description provided"}
          </Card.Text>

          <div className="d-flex gap-3 mb-3">
            <Badge
              bg={getStatusColor(task.status)}
              className="d-flex align-items-center"
            >
              <CheckCircle className="me-2" size={16} />
              Status: {task.status}
            </Badge>
            <Badge
              bg={getPriorityColor(task.priority)}
              className="d-flex align-items-center"
            >
              <Flag className="me-2" size={16} />
              Priority: {task.priority}
            </Badge>
          </div>

          <div className="d-flex gap-3">
            <Badge bg="light" text="dark" className="d-flex align-items-center">
              <Calendar className="me-2" size={16} />
              Created: {formatDate(task.createdAt)}
            </Badge>
            {task.updatedAt && (
              <Badge
                bg="light"
                text="dark"
                className="d-flex align-items-center"
              >
                <Clock className="me-2" size={16} />
                Updated: {formatDate(task.updatedAt)}
              </Badge>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};

export default TaskDetails;
