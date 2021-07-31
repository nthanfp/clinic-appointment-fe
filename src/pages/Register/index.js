import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';

import { Navbar } from '../../components';

const Register = () => {
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      username: '',
      age: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .min(2, 'Minimum 2 characters')
        .required('Required!'),
      last_name: Yup.string()
        .min(2, 'Minimum 2 characters')
        .required('Required!'),
      age: Yup.number()
        .min(18, 'Minimum age is 18!')
        .required('Required!'),
      username: Yup.string()
        .min(3, 'Minimum 3 characters')
        .max(10, 'Max 10 characters')
        .required('Required!'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Required!'),
      password: Yup.string()
        .min(6, 'Minimum 6 characters')
        .required('Required!'),
    }),
    onSubmit: (values, { resetForm, setSubmitting, setFieldError }) => {
      setMsg('');
      setError(false);
      setSuccess(false);
      const data = JSON.stringify(values);
      axios
        .post('https://clinic-info.herokuapp.com/api/user/register', data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          const msg = res.data.message;
          if (msg === 'User added successfully') {
            setMsg(msg);
            setSuccess(true);
          }
        })
        .catch(function (error) {
          setError(true);
          if (error.response) {
            const msg = error.response.data.message;
            if (msg === 'Email has been registered!') {
              setFieldError('email', msg);
            } else if (msg === 'Username has been used!') {
              setFieldError('username', msg);
            } else {
              setMsg(msg);
            }
          } else {
            setMsg(error.message);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
      // resetForm();
    },
  });

  console.log(msg);

  return (
    <div>
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Col className="mt-5 mb-5" xs lg="6">
            <Card border="primary">
              <Card.Header className="bg-primary text-white">
                Register
              </Card.Header>
              <Card.Body>
                {(() => {
                  if (error && msg.length > 2) {
                    return <Alert variant="danger">{msg}</Alert>;
                  } else if (success && msg.length > 2) {
                    return <Alert variant="success">{msg}</Alert>;
                  }
                })()}
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Row>
                      <Col>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="First name"
                          name="first_name"
                          value={formik.values.first_name}
                          onChange={formik.handleChange}
                          isInvalid={!!formik.errors.first_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.first_name}
                        </Form.Control.Feedback>
                      </Col>
                      <Col>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Last name"
                          name="last_name"
                          value={formik.values.last_name}
                          onChange={formik.handleChange}
                          isInvalid={!!formik.errors.last_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.last_name}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Age"
                      name="age"
                      value={formik.values.age}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.age}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.age}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      name="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid gap-2 mt-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? 'Loading...' : 'Register'}
                    </Button>
                  </div>
                </Form>
                <p className="mt-3 text-center">
                  Have an account? <Link to="/auth/login">Login</Link> now
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
