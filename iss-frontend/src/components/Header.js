import React, {Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Logo from '../Logo/Logo.svg'

import ImageUploadButton from './ImageUploadButton';
import SettingsButton from './SettingsButton';
import ExportButton from './ExportButton';
import ClusterButton from './Clusterbutton';
import InstructionsButton from './InstructionsButton';

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
            <div id="header">
                <Navbar expand="lg" style={{padding: "0.5em 1em 0.5em 1em"}}>
                <Navbar.Brand><img alt="" src={Logo} width="50px"/></Navbar.Brand>  
                    <Navbar.Brand id="brand">Image Similarity Search</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <ClusterButton/>
                            <ImageUploadButton/>
                            <ExportButton/>
                            <SettingsButton/>
                            <InstructionsButton/>
                        </Nav>
                    </Navbar.Collapse> 
                </Navbar>
            </div>
        )
    }
}

export default Header