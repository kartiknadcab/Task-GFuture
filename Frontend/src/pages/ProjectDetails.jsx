import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Card, Badge } from 'react-bootstrap';
import TasksList from '../components/tasks/TasksList';
import { getProject } from '../api/api';
import { formatDate } from '../utils';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await getProject(id);
        setProject(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading && !project) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!project) {
    return <Alert variant="info">Project not found</Alert>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{project.title}</h2>
        <Button as={Link} to="/dashboard" variant="outline-secondary">
          Back to Projects
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Card.Text>{project.description}</Card.Text>
          <div className="d-flex gap-3">
            <Badge bg="light" text="dark">
              Created: {formatDate(project.createdAt)}
            </Badge>
            {project.updatedAt && (
              <Badge bg="light" text="dark">
                Updated: {formatDate(project.updatedAt)}
              </Badge>
            )}
          </div>
        </Card.Body>
      </Card>

      <TasksList projectId={id} />
    </Container>
  );
};

export default ProjectDetails;