import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 

  LayoutDashboard, 
  LogIn, 
  UserPlus, 

} from 'lucide-react';

const AppNavbar = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar 
      bg="white" 
      variant="light" 
      expand="lg" 
      className="shadow-sm py-3"
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center fw-bold"
        >
          <LayoutDashboard className="me-2 text-primary" />
          Project Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
           
          </Nav>
          <Nav>
      
              <div className="d-flex">
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="me-3 d-flex align-items-center"
                >
                  <LogIn className="me-2" size={20} />
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register" 
                  className="d-flex align-items-center"
                >
                  <UserPlus className="me-2" size={20} />
                  Register
                </Nav.Link>
              </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;