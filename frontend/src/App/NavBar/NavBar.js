import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <Navbar.Brand className="ml-3">
        <NavLink to="/">
          {'recommender'}
        </NavLink>
      </Navbar.Brand>
      
      <Nav className="mr-3">
        <NavLink to="/songs" className="mx-3">
          {'songs'}
        </NavLink>
        <NavLink to="/albums" className="mx-3">
          {'albums'}
        </NavLink>
        <NavLink to="/artists" className="mx-3">
          {'artists'}
        </NavLink>
        <NavLink to="/register" className="mx-3">
          {'sign up'}
        </NavLink>
      </Nav>
    </Navbar>
  )
}

export default NavBar;