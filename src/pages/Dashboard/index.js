import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BaseLayout, Navbar } from '../../components';
import { Row, Button, Modal, Form } from 'react-bootstrap';

import { getToken, isLoggedInAsAdmin } from '../../utils/Common';
import { CardPatient, CardAdmin } from '../../components';

const Dashboard = (props) => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [value, setValue] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [modalAdd, setModalAdd] = useState(false);

  const handleModalAddClose = () => setModalAdd(false);
  const handleModalAddShow = () => setModalAdd(true);

  const token = getToken();

  const formik = useFormik({
    initialValues: {
      doctor_name: '',
      description: '',
    },
    validationSchema: Yup.object({
      doctor_name: Yup.string()
        .min(3, 'Minimum 3 characters')
        .required('Required!'),
      description: Yup.string()
        .min(6, 'Minimum 6 characters')
        .required('Required!'),
    }),
    onSubmit: (values, { resetForm, setSubmitting, setFieldError }) => {
      setValue('');
      const data = JSON.stringify(values);
      axios
        .post('https://clinic-info.herokuapp.com/api/appointment', data, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        })
        .then((res) => {
          alert('Success...');
          setValue('appointment-add');
        })
        .catch((err) => {
          alert('Error...');
        });
    },
  });

  const listAppointment = () => {
    axios
      .get('https://clinic-info.herokuapp.com/api/appointment', {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setAppointmentData(res.data.data);
      });
    setLoading(false);
  };

  const callback = useCallback((value) => {
    setValue(value);
  }, []);

  useEffect(() => {
    listAppointment();
    // eslint-disable-next-line
  }, [value]);

  return (
    <>
      <Navbar />
      <BaseLayout title="Dashboard Page" col="12" className="mt-4">
        {/* <h4 className="h4">Welcome {user.first_name}!</h4> */}
        {/* <div className="d-grid gap-2 mt-2 mb-4">
          <Button variant="primary" type="submit" onClick={handleLogout}>
            Logout
          </Button>
        </div> */}
        <div className="mt-2 mb-2">
          {(() => {
            if (isLoggedInAsAdmin()) {
              return (
                <Button variant="primary" onClick={handleModalAddShow}>
                  Add Appointment
                </Button>
              );
            }
          })()}
        </div>

        <Row>
          {appointmentData.map((appointment) => {
            if (isLoggedInAsAdmin()) {
              return (
                <CardAdmin
                  key={appointment._id}
                  data={appointment}
                  parentCallback={callback}
                />
              );
            } else {
              return (
                <CardPatient
                  key={appointment._id}
                  data={appointment}
                  parentCallback={callback}
                />
              );
            }
          })}
        </Row>
      </BaseLayout>

      <Modal show={modalAdd} onHide={handleModalAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Doctor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter doctor name"
                name="doctor_name"
                value={formik.values.doctor_name}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.doctor_name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.doctor_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2 mt-2">
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Loading...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Dashboard;
