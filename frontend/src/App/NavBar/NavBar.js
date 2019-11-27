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
    <Nav.Item>
      <NavDropdown title={currentUser ? currentUser.username : 'ayy'} className="navbar-dropdown">
        <LinkContainer to="/profile">
          <NavDropdown.Item className="navbar-dropdown-item">
            {'profile'}
          </NavDropdown.Item>
        </LinkContainer>
        <NavDropdown.Divider />
        <LinkContainer to="/">
          <NavDropdown.Item className="navbar-dropdown-item" onClick={handleLogout}>
            {'logout'}
          </NavDropdown.Item>
        </LinkContainer>
      </NavDropdown>
    </Nav.Item>
  );

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" className="justify-content-between">
      <LinkContainer to="/">
        <Navbar.Brand className="ml-5">
          {'recommender'}
        </Navbar.Brand>
      </LinkContainer>

      <Nav className="justify-content-between mr-5">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
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
        </Navbar.Collapse>
      </Nav>


    </Navbar>
  )
}

export default NavBar;