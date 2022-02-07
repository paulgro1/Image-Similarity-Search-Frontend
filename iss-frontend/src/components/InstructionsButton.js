import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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
import ClusterOn from '../InstructionIcons/ClusterOnButton.png';
import ClusterOff from '../InstructionIcons/ClusterOffButton.png';
import scrollInfo from '../InstructionIcons/scroll-2.png';

import '../layout/css/instructionsStyle.css'


const mapStateToProps = state => {
    return state
}

/**
 * Class representing the instructions button component.
 * @prop {function} showInstructionsDialogAction - shows the instructions dialog
 * @prop {function} hideInstructionsDialogAction - hides the instructions dialog
 * 
 * @extends {Component}
 */
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
            <div >
                <Button variant="outline-success" onClick={this.handleShow}> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                </Button>

                <Modal show={showDialog} onHide={this.handleClose} scrollable={true}>
                    <Modal.Header closeButton>
                    
                        <Modal.Title>Instructions</Modal.Title>
                        &nbsp;
                        <img src={scrollInfo} height={20} width={20} alt="scroll info" />
                       
                    </Modal.Header>
                    <Modal.Body className="show-grid ">
        <Container>
          
        <table class="table table-striped">
        <div class="container-fluid" id="bordercontainer">
   



   
        <div class="row">

<Row>
<div class="col" align="center" >
          <Col xs={12} md={8}>
          The settings can not be changed while images are marked
            </Col>
            </div>
</Row>
</div>

<div class="row">

<Row><div class="col" align="center">
          <Col xs={12} md={8}>
          To reset the marking of the images, click on the white area
            </Col>
            </div>
</Row>
</div>
   
   
    <div class="row">
       <Row>

          <div class="col">

          <Col xs={6} md={4}>
          <div class="col-xs-1" align="center">
          <img src={scrollimage} height={50} width={50} alt="scroll icon" />
          </div>
           </Col>
          </div>

          <div class="col">
          <Col xs={12} md={8}>
            Scroll with your mouse up and down to zoom in and out.<br/>
            Or Double click on the canvas to zoom in.
            </Col>
            </div>

          </Row>

          </div>


          <div class="row">

            <Row>
            <div class="col">
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={leftclickandpan} height={50} width={50} alt="left click and pen icon" />
            </div>
            </Col>
            </div>

            <div class="col">
          <Col xs={12} md={8}>
            Click left and pan to slide through the dataset
            </Col>
            </div>
            </Row>

            </div>


          <div class="row">

          <Row>
          <div class="col">
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={leftclick} height={50} width={50} alt="left click icon"/>
            </div>
            </Col>
            </div>

            <div class="col">
            <Col xs={12} md={8}>
            One left click on an image to get the nearest neighbours
            </Col>
            </div>
          </Row>

          </div>
            

          <div class="row">

            <Row>
            <div class="col">
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={leftclick} height={50} width={50} alt=" double left click icon" />
            </div>
            </Col>
            </div>

            <div class="col">
            <Col xs={12} md={8}>
           Double left click on an image to go to the detail view, nearest neighbours, similarity, option to export data.<br/>
           When the picture is already selected, a single click is enough
            </Col>
            </div>
            </Row>

            </div>


            <div class="row">

            <Row>
            <div class="col">
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={settingsButton} height={45} width={45} alt="setting buttom"/>
            </div>
            </Col>
            </div>

            <div class="col">
            <Col xs={12} md={8}>
              Click here to define the numbers of nearest neighbours and/or clusters with a slider
            </Col>
            </div>
            </Row>

            </div>


           <div class="row">

            <Row>
            <div class="col">
            <Col xs={6} md={4}>
            <div class="col-xs-1" align="center">
            <img src={exportButton} height={42} width={45} alt="export button"/>
            </div>
            </Col>
            </div>

            <div class="col">
            <Col xs={12} md={8}>
              Click here to export (marked) nearest neighbours in a table
            </Col>
            </div>
            </Row>

            </div>


            <div class="row">

            <Row>
            <div class="col">
            <Col xs={6} md={4} >

            <div class="col-xs-1" align="center">
            <img src={uploadImageButton} height={40} width={100} alt="uploadbutton"/>
            </div>

            </Col>
            </div>

            <div class="col">
            <Col xs={12} md={8}>
              Click here to choose between single- and multiupload, than the option is given to crop a single image 
            </Col>
            </div>
            </Row>
            </div>


            <div class="row">

            <Row>
            <div class="col">
            <Col xs={6} md={4} >

            <div class="col-xs-1" align="center">
            <img src={ClusterOn} height={40} width={100} alt="cluster on button"/>
            <img src={ClusterOff} height={40} width={100} alt="cluster off button"/>
            </div>

            </Col>
            </div>

            <div class="col">
            <Col xs={12} md={8}>
            The clusters and their colors can be activated or deactivated with a left click on these buttons, or can specify with a click on an image            </Col>
            </div>
            </Row>
            </div>



            </div>
    </table>
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
