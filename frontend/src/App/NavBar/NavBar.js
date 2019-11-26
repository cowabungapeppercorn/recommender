import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { UserContext } from '../../userContext';
import './NavBar.css';

function NavBar(props) {
  const { currentUser, handleLogout } = useContext(UserContext);

  const noCurrentUserNavLink = (
    <Nav.Item>
      <LinkContainer to="/auth">
        <Nav.Link>{'login'}</Nav.Link>
      </LinkContainer>
    </Nav.Item>
  );

  const currentUserNavLink = (
    <NavDropdown title={currentUser ? currentUser.username : 'ayy'}>
      <LinkContainer to="/">
        <NavDropdown.Item>
          {'profile'}
        </NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to="/">
        <NavDropdown.Item onClick={handleLogout}>
          {'logout'}
        </NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  );

  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <LinkContainer to="/">
        <Navbar.Brand className="ml-3">
          {'recommender'}
        </Navbar.Brand>
      </LinkContainer>

      <Nav className="mr-3">
        <Nav.Item>
          <LinkContainer to="/songs">
            <Nav.Link>songs</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/albums">
            <Nav.Link>{'albums'}</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/artists">
            <Nav.Link>{'artists'}</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        {currentUser ? currentUserNavLink : noCurrentUserNavLink}
      </Nav>
    </Navbar>
  )
}

export default NavBar;