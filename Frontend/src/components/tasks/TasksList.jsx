import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Spinner, 
  Alert, 
  Pagination,
  Form,
  Badge
} from 'react-bootstrap';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { getTasks, createTask, updateTask, deleteTask } from '../../api/api';
import { getPriorityColor, getStatusColor } from '../../utils';

const TasksList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getTasks(projectId, page, 10, filters);
      setTasks(data.tasks);
      setTotalPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, page, filters]);

  const handleCreate = async (taskData) => {
    try {
      setLoading(true);
      await createTask(projectId, taskData);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (taskData) => {
    try {
      setLoading(true);
      await updateTask(currentTask._id, taskData);
      setShowForm(false);
      setCurrentTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await deleteTask(id);
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
    });
    setPage(1);
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>Tasks</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowForm(true)}>Create Task</Button>
        </Col>
      </Row>

      {/* Filters */}
      <div className="mb-4 p-3 bg-light rounded">
        <h5>Filters</h5>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && tasks.length === 0 ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : tasks.length === 0 ? (
        <Alert variant="info">No tasks found</Alert>
      ) : (
        <>
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                />
                {[...Array(totalPages).keys()].map((x) => (
                  <Pagination.Item
                    key={x + 1}
                    active={x + 1 === page}
                    onClick={() => setPage(x + 1)}
                  >
                    {x + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      <TaskForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setCurrentTask(null);
        }}
        onSubmit={currentTask ? handleUpdate : handleCreate}
        initialData={currentTask || {}}
        loading={loading}
      />
    </Container>
  );
};

export default TasksList;