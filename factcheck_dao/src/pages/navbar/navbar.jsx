import React from "react";
import {Link} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
function CustomNavbar({balance, address}) {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Link className="navbar-brand" to="/factcheck/list">
                    FactCheck DAO
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/factcheck/request">
                            FCを依頼
                        </Link>
                        <Link className="nav-link" to="/factcheck/receive_list">
                            FCを投稿
                        </Link>
                        <Link className="nav-link" to="/dao">
                            DAO
                        </Link>
                    </Nav>
                    <Nav>
                        <Nav.Link>{balance}FC</Nav.Link>
                        <Link className="nav-link" to={"/user/" + address}>
                            MyPage
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
