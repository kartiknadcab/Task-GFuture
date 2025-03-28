import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Spinner, 
  Alert, 
  Pagination,
  Form,
  Card,
  Badge
} from 'react-bootstrap';
import { 
  PlusCircle, 
  Filter, 
  RefreshCw, 
  List, 
  AlertTriangle 
} from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="tasks-list-container">
      <Container>
        <div className="tasks-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="tasks-title">Project Tasks</h1>
              <div className="tasks-summary">
                <Badge bg="light" text="dark" className="me-2">
                  <List size={16} className="me-1" /> Total Tasks: {tasks.length}
                </Badge>
                {filters.status && (
                  <Badge bg={getStatusColor(filters.status)} className="me-2">
                    {filters.status} Status
                  </Badge>
                )}
                {filters.priority && (
                  <Badge bg={getPriorityColor(filters.priority)} className="me-2">
                    {filters.priority} Priority
                  </Badge>
                )}
              </div>
            </div>
            <div className="tasks-actions">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowFilters(!showFilters)}
                className="me-2"
              >
                <Filter size={16} className="me-1" /> 
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
              >
                <PlusCircle size={16} className="me-1" /> Create Task
              </Button>
            </div>
          </div>
        </div>


        {showFilters && (
          <Card className="filters-card mb-4">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <Filter size={18} className="me-2" /> Filter Tasks
              </Card.Title>
              <Form>
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
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
                  <Col md={5}>
                    <Form.Group className="mb-3">
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
                  <Col md={2} className="d-flex align-items-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={clearFilters}
                      className="w-100"
                    >
                      <RefreshCw size={16} className="me-1" /> Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        )}

  
        {error && (
          <Alert variant="danger" className="error-alert">
            <AlertTriangle size={20} className="me-2" />
            {error}
          </Alert>
        )}

 
        {loading && tasks.length === 0 ? (
          <div className="loading-container">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="no-tasks-card text-center">
            <Card.Body>
              <List size={48} className="text-muted mb-3" />
              <h4>No Tasks Found</h4>
              <p className="text-muted">
                Create your first task for this project
              </p>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
              >
                <PlusCircle size={16} className="me-1" /> Create Task
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
         
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>

 
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination className="custom-pagination">
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
    </div>
  );
};

export default TasksList;