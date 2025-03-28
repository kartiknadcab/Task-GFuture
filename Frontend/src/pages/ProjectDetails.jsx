import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Spinner, 
  Alert, 
  Button, 
  Card, 
  Badge, 
  Breadcrumb 
} from 'react-bootstrap';
import { 
  ArrowLeft, 
  Calendar, 
  Edit2, 
  Folder, 
  Clock, 
  Info 
} from 'lucide-react';
import TasksList from '../components/tasks/TasksList';
import { getProject } from '../api/api';
import { formatDate } from '../utils';
import DashNav from '../components/DashNav';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleEditProject = () => {
    navigate(`/projects/edit/${id}`);
  };

  if (loading && !project) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="error-alert">
          <div className="d-flex align-items-center">
            <Info className="me-2" size={24} />
            {error}
          </div>
        </Alert>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="mt-4">
        <Alert variant="info" className="not-found-alert">
          <Folder className="me-2" size={24} />
          Project not found
        </Alert>
      </Container>
    );
  }

  return (
    <div className="project-details-container">
              <DashNav />

      <Container>
        <Breadcrumb className="mt-3 mb-4">
          <Breadcrumb.Item href="/dashboard">Projects</Breadcrumb.Item>
          <Breadcrumb.Item active>{project.title}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="project-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="project-title">{project.title}</h1>
              <div className="project-meta d-flex align-items-center">
                <Badge bg="light" text="dark" className="me-2">
                  <Folder size={16} className="me-1" /> Project
                </Badge>
                {project.status && (
                  <Badge 
                    bg={
                      project.status === 'completed' ? 'success' : 
                      project.status === 'in-progress' ? 'primary' : 
                      'secondary'
                    }
                  >
                    {project.status}
                  </Badge>
                )}
              </div>
            </div>
            <div className="project-actions">
            
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft size={16} className="me-1" /> Back to Projects
              </Button>
            </div>
          </div>
        </div>

        <Card className="project-details-card mb-4 shadow-sm">
          <Card.Body>
            <div className="row">
              <div className="col-12 col-md-8">
                <h4 className="card-title mb-3">Project Description</h4>
                <p className="project-description">
                  {project.description || 'No description provided'}
                </p>
              </div>
              <div className="col-12 col-md-4">
                <div className="project-metadata">
                  <div className="metadata-item">
                    <Calendar size={18} className="me-2 text-muted" />
                    <span>
                      Created: {formatDate(project.createdAt)}
                    </span>
                  </div>
                  {project.updatedAt && (
                    <div className="metadata-item">
                      <Clock size={18} className="me-2 text-muted" />
                      <span>
                        Last Updated: {formatDate(project.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <TasksList projectId={id} />
      </Container>
    </div>
  );
};

export default ProjectDetails;