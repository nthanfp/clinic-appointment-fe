import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Navbar as NavbarBs, Nav, Container } from 'react-bootstrap';

import { isLoggedIn, removeUserSession } from '../../../utils/Common';

const Navbar = () => {
  let history = useHistory();
  const handleLogout = () => {
    removeUserSession();
    history.push('/auth/login');
  };

  return (
    <>
      <NavbarBs bg="primary" variant="dark" expand="lg">
        <Container>
          <NavbarBs.Brand href="/">Clinic-Info</NavbarBs.Brand>
          <NavbarBs.Toggle aria-controls="basic-navbar-nav" />
          <NavbarBs.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {(() => {
                if (isLoggedIn()) {
                  return (
                    <>
                      <NavLink
                        to="/dashboard"
                        className="nav-item nav-link"
                        exact
                        activeClassName="active"
                      >
                        Dashboard
                      </NavLink>
                    </>
                  );
                } else {
                  return (
                    <>
                      <NavLink
                        to="/"
                        className="nav-item nav-link"
                        exact
                        activeClassName="active"
                      >
                        Home
                      </NavLink>
                      <NavLink
                        to="/about"
                        className="nav-item nav-link"
                        exact
                        activeClassName="active"
                      >
                        About
                      </NavLink>
                      <NavLink
                        to="/contact"
                        className="nav-item nav-link"
                        exact
                        activeClassName="active"
                      >
                        Contact
                      </NavLink>
                    </>
                  );
                }
              })()}
            </Nav>
            <Nav>
              {(() => {
                if (isLoggedIn()) {
                  return (
                    <>
                      <NavLink
                        to="/"
                        className="nav-item nav-link"
                        exact
                        activeClassName="active"
                        onClick={handleLogout}
                      >
                        Logout
                      </NavLink>
                    </>
                  );
                } else {
                  return (
                    <>
                      <NavLink
                        to="/auth/login"
                        className="nav-item nav-link"
                        exact
                        activeClassName="active"
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/auth/register"
                        className="nav-item nav-link"
                        exact
                        activeClassName="active"
                      >
                        Register
                      </NavLink>
                    </>
                  );
                }
              })()}
            </Nav>
          </NavbarBs.Collapse>
        </Container>
      </NavbarBs>
    </>
  );
};

export default Navbar;
