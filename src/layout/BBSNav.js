import React from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';

export default function BBSNav() {
    return (
      <>
        <Navbar bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="/">대피소 안내해드려요</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/shelter">대피소 안내</Nav.Link>
              <Nav.Link href="/manual">대피요령</Nav.Link>
              <Nav.Link href="/makers">만든이</Nav.Link>
              <Nav.Link href="/example">예제</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        </>    
    );
}