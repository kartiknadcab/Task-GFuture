import React from 'react';
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {  Calendar, CheckSquare, Rocket } from "lucide-react";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <>
      <Layout />
      <div className="py-5 bg-gradient-primary text-white">
        <Container>
          <Row className="align-items-center text-black">
            <Col md={6} className="text-center text-md-start">
              <h1 className="display-4 fw-bold mb-4 ">
                Project Management Simplified
              </h1>
              <p className="lead mb-5">
                Streamline your workflow, collaborate effortlessly, and boost 
                productivity with our intuitive project management tool.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start gap-3">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="light" 
                  size="lg" 
                  className="px-4 py-2 shadow-sm"
                >
                  Login
                </Button>
             
              </div>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <div className="d-flex justify-content-center">
                <div className="position-relative">
                  <Card className="shadow-lg border-0" style={{ width: '18rem' }}>
                    <Card.Body className="text-center">
                      <div className="d-flex justify-content-around mb-4">
                        <Calendar className="text-primary" size={48} />
                        <CheckSquare className="text-success" size={48} />
                        <Rocket className="text-warning" size={48} />
                      </div>
                      <Card.Title className="h4 mb-3">
                        Manage Your Projects
                      </Card.Title>
                      <Card.Text className="text-muted">
                        Track, collaborate, and achieve your goals with ease.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;