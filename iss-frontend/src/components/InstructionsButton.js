import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Gear } from "react-bootstrap-icons";
import { Col, Row, Container } from "react-bootstrap";
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as instructionsActions from '../actions/InstructionActions';


import scrollimage from '../InstructionIcons/scroll.png';
import leftclickandpan from '../InstructionIcons/left-click-2.png';
import leftclick from '../InstructionIcons/left-click.png';
import settingsButton from '../InstructionIcons/settingsButton.png';
import uploadImageButton from '../InstructionIcons/uploadImageButton.png';
import exportButton from '../InstructionIcons/exportButton.png';

const mapStateToProps = state => {
    return state
}


class InstructionsButton extends Component {

    /**
     * Create a InstructionButton component.
     * @param {object} props - properties from redux store
     */
    constructor(props){
        super(props)
        this.state = {
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    /**
     * This function opens the instruction dialog.
     */
    handleShow(e){
        e.preventDefault();
        const {showInstructionsDialogAction} = this.props;
        showInstructionsDialogAction();
    }

    /**
     * This function closes the instruction dialog.
     */
    handleClose(){
        const {hideInstructionsDialogAction} = this.props;
        hideInstructionsDialogAction();
    } 


    /**
     * This function renders the instruction button and modal dialog.
     * @returns {object} - React component
     */
    render(){

        var showDialog = this.props.showInstructionsDialog
        if(showDialog === undefined){
            showDialog = false;
        }


        return (
            <div>
                <Button variant="outline-success" onClick={this.handleShow}> 
                    <Gear/>
                </Button>

                <Modal show={showDialog} onHide={this.handleClose} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Instructions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid">
        <Container>
          
          <Row>
          <Col xs={6} md={4}>
          <div class="col-xs-1" align="center">
          <img src={scrollimage} height={50} width={50} alt="scroll icon" />
          </div>
           </Col>
          <Col xs={12} md={8}>
              Zoom in and out
            </Col>
          </Row>


            <Row>
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={leftclickandpan} height={50} width={50} alt="left click and pen icon" />
            </div>
            </Col>
          <Col xs={12} md={8}>
              Slide through the dataset
            </Col>
            </Row>


          <Row>
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={leftclick} height={50} width={50} alt="left click icon"/>
            </div>
            </Col>
            <Col xs={12} md={8}>
              Click to get the nearest neighbours
            </Col>
          </Row>
            

            <Row>
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={leftclick} height={50} width={50} alt=" double left click icon" />
            </div>
            </Col>
            <Col xs={12} md={8}>
              Double Click to get the detail view, nearest neighbours, similarity, option to export data
            </Col>
            </Row>


            <Row>
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={settingsButton} height={50} width={50} alt="setting buttom"/>
            </div>
            </Col>
            <Col xs={12} md={8}>
              Click here to set number of nearest neighbours with a Slider
            </Col>
            </Row>
           

            <Row>
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={exportButton} height={50} width={50} alt="export button"/>
            </div>
            </Col>
            <Col xs={12} md={8}>
              Click here to export (clicked) nearest neighbours in a table
            </Col>
            </Row>


            <Row>
            <Col xs={6} md={4} >
            <div class="col-xs-1" align="center">
            <img src={uploadImageButton} height={50} width={120} alt="uploaded image button"/>
            </div>
            </Col>
            <Col xs={12} md={8}>
              Click here to choose between Single- and Multiupload
            </Col>
            </Row>
    
        </Container>
      </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showInstructionsDialogAction: instructionsActions.getShowInstructionsDialogAction,
    hideInstructionsDialogAction: instructionsActions.getHideInstructionsDialogAction,
},dispatch)

const connectedInstructionsButton = connect(mapStateToProps, mapDispatchToProps)(InstructionsButton);
export default connectedInstructionsButton;
