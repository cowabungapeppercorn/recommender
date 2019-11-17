import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { UserContext } from '../../userContext';

function NavBar(props) {
  const { currentUser, handleLogout } = useContext(UserContext);
  
  const loginNavLink = (
    <NavLink to="/auth" className="mx-3">
      {'login'}
    </NavLink>
  );

  const logoutNavLink = (
    <NavLink to="/" className="mx-3" onClick={handleLogout}>
      {'logout'}
    </NavLink>
  );

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
        {currentUser ? logoutNavLink : loginNavLink}
      </Nav>
    </Navbar>
  )
}

export default NavBar;