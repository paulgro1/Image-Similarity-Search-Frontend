import React, {Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import ImageUploadButton from './ImageUploadButton';
import SettingsButton from './SettingsButton';
import ExportButton from './ExportButton';

import '../layout/css/HeaderStyle.css'

/**
 * Class representing the header component.
 * @extends {Component}
 */
class Header extends Component {

    /**
     * This function renders the header.
     * @returns {object} - React component
     */
    render() {
        return(
            <div>
                <Navbar bg="light" expand="lg" style={{padding: "0.5em 1em 0.5em 1em"}}>  
                    <Navbar.Brand>Image Similarity Search Project</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <ImageUploadButton/>
                            <ExportButton/>
                            <SettingsButton/>
                        </Nav>
                    </Navbar.Collapse> 
                </Navbar>
            </div>
        )
    }
}

export default Header