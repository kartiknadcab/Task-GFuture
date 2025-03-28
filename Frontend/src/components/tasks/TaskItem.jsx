import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {  getPriorityColor, getStatusColor } from '../../utils';

const TaskItem = ({ task, onDelete, onEdit }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Link to={`/tasks/${task._id}`}>{task.title}</Link>
        </Card.Title>
        <Card.Text>{task.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Badge bg={getStatusColor(task.status)} className="me-2">
              {task.status}
            </Badge>
            <Badge bg={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskItem;