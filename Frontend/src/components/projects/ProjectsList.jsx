import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Pagination,
  Card,
} from "react-bootstrap";
import {
  PlusCircle,
  Folder,
  Edit2,
  Trash2,
  AlertCircle,
  Calendar,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  API_URL,
  Image_URL,
} from "../../api/api";

const ProjectItem = ({ project, onDelete, onEdit, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      className="mb-3 shadow-sm hover-lift cursor-pointer"
      onClick={() => onView(project)}
    >
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {project.image ? (
            <div
              className="me-3"
              style={{ width: "64px", height: "64px", overflow: "hidden" }}
            >
              <img
                src={`${Image_URL}${project.image}`}
                alt={project.name}
                className="img-fluid rounded"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          ) : (
            <Folder className="me-3 text-primary" size={24} />
          )}
          <div>
            <h5 className="mb-1">{project.name}</h5>
            <p className="text-muted mb-1">
              <Info size={16} className="me-2 text-muted" />
              {project.description || "No description"}
            </p>
            <div className="d-flex align-items-center text-muted">
              <Calendar size={16} className="me-2" />
              <small>Created: {formatDate(project.createdAt)}</small>
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            <Edit2 size={16} className="me-1" /> Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
            }}
          >
            <Trash2 size={16} className="me-1" /> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getProjects(page);
      setProjects(data.projects);
      setTotalPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const handleCreate = async (projectData) => {
    try {
      setLoading(true);
      await createProject(projectData);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (projectData) => {
    try {
      setLoading(true);
      await updateProject(currentProject._id, projectData);
      setShowForm(false);
      setCurrentProject(null);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setLoading(true);
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete project");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setShowForm(true);
  };

  const handleViewProject = (project) => {
    navigate(`/projects/${project._id}`);
  };

  return (
    <Container fluid className="px-2 py-5">
      <Row className="mb-4 align-items-center text-center text-md-start">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <h1 className="fw-bold">Project Management</h1>
          <p className="text-muted">View, create, and manage your projects</p>
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center justify-content-md-end"
        >
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            className="d-flex align-items-center gap-2"
          >
            <PlusCircle size={20} /> Create Project
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <AlertCircle className="me-2" size={20} />
          {error}
        </Alert>
      )}

      {loading && projects.length === 0 ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card className="text-center">
          <Card.Body>
            <Folder className="mb-3 text-muted" size={48} />
            <h4>No Projects Found</h4>
            <p className="text-muted">
              Create your first project by clicking "Create Project"
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          {projects.map((project) => (
            <ProjectItem
              key={project._id}
              project={project}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleViewProject}
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

      <ProjectForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setCurrentProject(null);
        }}
        onSubmit={currentProject ? handleUpdate : handleCreate}
        initialData={currentProject || {}}
        loading={loading}
      />
    </Container>
  );
};

export default ProjectsList;
