import React, { useEffect } from 'react';
import axios from 'axios';

import { Routes } from '../config';
import {
  getToken,
  getUser,
  setUserSession,
  removeUserSession,
} from '../utils/Common';

function App() {
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    const user = getUser();

    const urlGet =
      user.role === 'admin'
        ? `https://clinic-info.herokuapp.com/api/user/${user.id}`
        : `https://clinic-info.herokuapp.com/api/user`;

    axios
      .get(urlGet, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      })
      .then((res) => {
        setUserSession(token, res.data.data);
      })
      .catch((err) => {
        removeUserSession();
      });
  }, []);

  return <Routes />;
}

export default App;
