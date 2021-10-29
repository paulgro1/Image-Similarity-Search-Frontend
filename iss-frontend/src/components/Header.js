import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import ImageUploadButton from './ImageUploadButton'

class Header extends Component {

    render() {
        return(
            <div>
                <Navbar bg="light" expand="lg" style={{padding: "0.5em 1em 0.5em 1em"}}>  
                    <Navbar.Brand>Image Similarity Search Project</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <ImageUploadButton/>
                        </Nav>
                    </Navbar.Collapse> 
                </Navbar>
            </div>
        )
    }
}

export default Header