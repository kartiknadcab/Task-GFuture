import { useState } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';

const ProjectForm = ({ show, onHide, onSubmit, initialData = {}, loading }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    image: null,
  });
  const [errors, setErrors] = useState({});

  const { title, description } = formData;

  const onChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title) {
      newErrors.title = 'Title is required';
    }

    if (!description) {
      newErrors.description = 'Description is required';
    }

    if (formData.image && formData.image.size > 1000000) {
      newErrors.image = 'Image size should not exceed 1MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    onSubmit(formDataToSend);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData._id ? 'Edit Project' : 'Create Project'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={description}
              onChange={onChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Project Image (max 1MB)</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={onChange}
              isInvalid={!!errors.image}
            />
            <Form.Control.Feedback type="invalid">
              {errors.image}
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectForm;