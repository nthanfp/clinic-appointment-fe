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
import { setUserSession } from '../../utils/Common';

const Login = (props) => {
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Minimum 3 characters')
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
        .post('https://clinic-info.herokuapp.com/api/user/login', data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          const msg = res.data.message;
          if (msg === 'Authentication success') {
            setMsg(msg);
            setSuccess(true);
            setUserSession(res.data.data.token);
            props.history.push('/dashboard');
          }
        })
        .catch(function (error) {
          setError(true);
          if (error.response) {
            const msg = error.response.data.message;
            if (msg === 'Username not found') {
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
    },
  });

  return (
    <div>
      <Navbar />
      <Container>
        <Row className="justify-content-md-center">
          <Col className="mt-5" xs lg="6">
            <Card border="primary">
              <Card.Header className="bg-primary text-white">
                Login
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
                      {formik.isSubmitting ? 'Loading...' : 'Login'}
                    </Button>
                  </div>

                  <p className="mt-3 text-center">
                    Dont have account?{' '}
                    <Link to="/auth/register">Register</Link> now
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
