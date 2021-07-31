import jwtDecode from 'jwt-decode';

const getUser = () => {
  const token = getToken();
  if (token != null) return jwtDecode(token);
  return null;
};

const getToken = () => {
  return localStorage.getItem('token') || null;
};

const isLoggedIn = () => {
  const data = getUser();
  if (data === null) return false;

  const now = Date.now().valueOf() / 1000;
  if (data.exp == null && data.exp < now) {
    removeUserSession();
    return false;
  }

  return true;
};

const isLoggedInAsAdmin = () => {
  const data = getUser();
  if (data === null) return false;

  const now = Date.now().valueOf() / 1000;
  if (data.exp == null && data.exp < now) {
    removeUserSession();
    return false;
  }

  if (data.role === 'admin') return true;

  return false;
};

const setUserSession = (token) => {
  localStorage.setItem('token', token);
};

const removeUserSession = () => {
  localStorage.removeItem('token');
};

export {
  getUser,
  getToken,
  setUserSession,
  removeUserSession,
  isLoggedIn,
  isLoggedInAsAdmin,
};
