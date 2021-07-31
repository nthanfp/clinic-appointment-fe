import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Modal, Col, Form } from 'react-bootstrap';
import { getToken } from '../../../utils/Common';

const AppointmentCard = ({ data, parentCallback }) => {
  const [modalEdit, setModalEdit] = useState(false);

  const handleModalEditClose = () => setModalEdit(false);
  const handleModalEditShow = () => setModalEdit(true);

  const { _id, doctor_name, description, registrant_list = [] } = data;
  const list_length = registrant_list.length;

  const token = getToken();

  const deleteAppointment = () => {
    axios
      .delete(`https://clinic-info.herokuapp.com/api/appointment/${_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        alert('Deleted...');
        parentCallback(`deleted-${_id}`);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const getAppointment = () => {
    axios
      .get(`https://clinic-info.herokuapp.com/api/appointment/${_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        alert('Get...');
        parentCallback(`getted-${_id}`);
        handleModalEditShow();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const formik = useFormik({
    initialValues: {
      doctor_name: doctor_name,
      description: description,
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
      const data = {
        id: _id,
        doctor_name: values.doctor_name,
        description: values.description,
      };
      axios
        .put('https://clinic-info.herokuapp.com/api/appointment', data, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        })
        .then((res) => {
          alert('Updated...');
          parentCallback(`updated-${_id}`);
        })
        .catch((err) => {
          alert('Error...');
        });
    },
  });

  return (
    <>
      <Col lg md="6" className="mb-4" key={_id}>
        <Card>
          <Card.Header>{doctor_name}</Card.Header>
          <Card.Body>
            <Card.Text>
              {description}
              <br />
              <b>
                <i>Remaining appointments: {10 - list_length}</i>
              </b>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" onClick={getAppointment}>
              Edit
            </Button>
            <Button
              variant="danger"
              className="float-end"
              onClick={deleteAppointment}
            >
              Delete
            </Button>
          </Card.Footer>
        </Card>
      </Col>
      <Modal show={modalEdit} onHide={handleModalEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
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

export default AppointmentCard;
