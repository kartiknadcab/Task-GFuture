import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import ProjectItem from './ProjectItem';
import ProjectForm from './ProjectForm';
import { getProjects, createProject, updateProject, deleteProject } from '../../api/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getProjects(page);
      setProjects(data.projects);
      setTotalPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
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
      setError(err.response?.data?.message || 'Failed to create project');
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
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true);
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setShowForm(true);
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>Projects</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowForm(true)}>Create Project</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && projects.length === 0 ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : projects.length === 0 ? (
        <Alert variant="info">No projects found</Alert>
      ) : (
        <>
          {projects.map((project) => (
            <ProjectItem
              key={project._id}
              project={project}
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