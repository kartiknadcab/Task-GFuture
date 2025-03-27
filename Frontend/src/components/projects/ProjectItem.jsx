import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils';

const ProjectItem = ({ project, onDelete, onEdit }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Link to={`/projects/${project._id}`}>{project.title}</Link>
        </Card.Title>
        <Card.Text>{project.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Created: {formatDate(project.createdAt)}
          </small>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => onEdit(project)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(project._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectItem;