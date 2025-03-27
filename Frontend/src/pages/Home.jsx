import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="py-5 bg-light">
      <Container className="text-center">
        <h1 className="display-4 mb-4">Project Management App</h1>
        <p className="lead mb-5">
          Manage your projects and tasks efficiently with our simple and intuitive tool.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button as={Link} to="/login" variant="primary" size="lg">
            Login
          </Button>
          <Button as={Link} to="/register" variant="outline-primary" size="lg">
            Register
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;