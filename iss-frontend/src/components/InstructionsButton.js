import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Row, Container } from "react-bootstrap";
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as instructionsActions from '../actions/InstructionActions';

import '../layout/css/instructionStyle.css'
import scrollimage from '../InstructionIcons/scroll.svg';
import warning from '../InstructionIcons/warning.svg';
import leftclickandpan from '../InstructionIcons/left-click-2.svg';
import leftclick from '../InstructionIcons/left-click.svg';
import doubleleftclick from '../InstructionIcons/doubleleftclick.svg';
import settingsButton from '../InstructionIcons/settingsButton.svg';
import uploadImageButton from '../InstructionIcons/uploadImageButton.svg';
import exportButton from '../InstructionIcons/exportButton.svg';
import Cluster from '../InstructionIcons/clusterButton.svg';

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
            <div>
                <Button variant="outline-success" onClick={this.handleShow}> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                </Button>

                <Modal id="modalCentered" show={showDialog} onHide={this.handleClose} scrollable={true} >
                    <Modal.Header id="instHeader" closeButton>
                    
                        <Modal.Title>Instructions</Modal.Title>
                        &nbsp;
                        
                       
                    </Modal.Header>
                    <Modal.Body id="instBody">
        <Container>
      
   



   
        <div class="row">

        <Row>
        <div class="col" id="attention">

                  <img id="attentionIcon" src={warning} height={20}  alt="scroll icon" />
                  The settings can not be changed while images are marked.<br></br><br></br>
                  <img id="attentionIcon" src={warning} height={20} alt="scroll icon" />
                  To reset the marking of the images, click on the white area around them.
                    
                    </div>
        </Row>
        </div>
   
   
    <div class="row">
       <Row>

        
            <div class="col">
              <img id="icon" src={scrollimage} height={100}  alt="scroll icon" /><br></br>
              Scroll up and down to zoom in and out.<br/>
              Or double click on the canvas to zoom in.
            </div>
            <div class="col">
              <img id="icon" src={leftclickandpan} height={100}  alt="scroll icon" /><br></br>
              Click left and pan to slide over the dataset.
            </div>
        </Row>
        </div>
        <div class="row">
        <Row>
            <div class="col">
              <img id="icon" src={leftclick} height={100}  alt="scroll icon" /><br></br>
              One left click on image to get the nearest neighbours.
            </div>
            <div class="col">
              <img id="icon" src={doubleleftclick} height={100}  alt="scroll icon" /><br></br>
              Double left click on image to go to detail view, nearest neighbours, similarity, option to export data.
              When the picture is already selected, a single click is enough.
            </div>
        
        </Row>
        </div>

        
        
        <div class="row">
        <Row>
            <div class="col">
              <img id="icon" src={settingsButton} height={100}  alt="scroll icon" /><br></br>
              Click here to define the numbers of nearest neighbours and/or clusters with a slider.
            </div>
            <div class="col">
              <img id="icon" src={exportButton} height={100}  alt="scroll icon" /><br></br>
              Click here to export the nearest neighbours of all images in a table.
            </div>
        </Row>
        </div>
        <div class="row">
        <Row>
            <div class="col">
              <img id="icon" src={uploadImageButton} height={100}  alt="scroll icon" /><br></br>
              Click here to choose between single- and multiupload, then the option is given to crop a single image.
            </div>
            <div class="col">
              <img id="icon" src={Cluster} height={100}  alt="scroll icon" /><br></br>
              The clusters and their colors can be activated or deactivated with a left click on these buttons, or can specify with a click on an image
            </div>
        </Row>
        </div>
        
        </Container>
      </Modal.Body>
                <Modal.Footer id="instFooter">

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
