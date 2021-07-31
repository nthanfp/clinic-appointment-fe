import React from 'react';
import axios from 'axios';
import { Button, Card, Col } from 'react-bootstrap';
import { getUser, getToken } from '../../../utils/Common';

const AppointmentCard = ({ data, parentCallback }) => {
  const { _id, doctor_name, description, registrant_list = [] } = data;
  const list_length = registrant_list.length;

  const user = getUser();
  const token = getToken();

  const applyAppointment = () => {
    const data = {
      id: _id,
      user_id: user.id,
    };
    axios
      .post(
        'https://clinic-info.herokuapp.com/api/appointment/apply',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        }
      )
      .then((res) => {
        alert('Success...');
        parentCallback(`apply-${_id}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const cancelAppointment = () => {
    const data = {
      id: _id,
      user_id: user.id,
    };
    axios
      .post(
        'https://clinic-info.herokuapp.com/api/appointment/cancel',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        }
      )
      .then((res) => {
        alert('Canceled...');
        parentCallback(`cancel-${_id}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  let registrant_user_id = -1;
  if (user != null) {
    for (const registrant of registrant_list) {
      if (registrant?.user_id === user?.id) {
        registrant_user_id = registrant?.user_id;
      }
    }
  }

  return (
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
          {list_length >= 10 ? (
            <Button variant="danger" disabled>
              Fully Booked
            </Button>
          ) : registrant_user_id === -1 ? (
            <Button
              variant="primary"
              onClick={() => applyAppointment(_id)}
            >
              Apply Appointment
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={() => cancelAppointment(_id)}
            >
              Cancel Appointment
            </Button>
          )}
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default AppointmentCard;
