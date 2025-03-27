import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Card, Badge } from 'react-bootstrap';
import { getTask } from '../api/api';
import { formatDate, getPriorityColor, getStatusColor } from '../utils';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await getTask(id);
        setTask(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading && !task) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!task) {
    return <Alert variant="info">Task not found</Alert>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{task.title}</h2>
        <Button 
          as={Link} 
          to={`/projects/${task.project._id}`} 
          variant="outline-secondary"
        >
          Back to Project
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Card.Text>{task.description}</Card.Text>
          <div className="d-flex gap-3 mb-3">
            <Badge bg={getStatusColor(task.status)}>
              Status: {task.status}
            </Badge>
            <Badge bg={getPriorityColor(task.priority)}>
              Priority: {task.priority}
            </Badge>
          </div>
          <div className="d-flex gap-3">
            <Badge bg="light" text="dark">
              Created: {formatDate(task.createdAt)}
            </Badge>
            {task.updatedAt && (
              <Badge bg="light" text="dark">
                Updated: {formatDate(task.updatedAt)}
              </Badge>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskDetails;