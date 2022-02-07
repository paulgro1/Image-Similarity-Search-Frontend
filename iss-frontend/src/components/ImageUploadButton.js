import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as imageUploadActions from '../actions/ImageUploadActions';
import React, { Component } from 'react';
import CropButton from './CropImage';
import '../layout/css/HeaderStyle.css'
import '../layout/css/imageUploadStyle.css'


const mapStateToProps = state => {
    return state
}

/**
 * Class representing the image upload button component.
 * @prop {function} imageUploadAction - uploads an image
 * @prop {function} showImageUploadDialogAction - shows modal dialog
 * @prop {function} hideImageUploadDialogAction - hides modal dialog
 * @prop {function} showImageCropDialogAction - shows crop image modal dialog
 * @prop {function} sendFilesToStoreAction - sends files to redux store
 * @prop {object} error - error message
 * @prop {boolean} pending - image upload pending
 * 
 * @extends {Component}
 */
class ImageUploadButton extends Component {

    /**
     * Create a ImageUploadButton component.
     * @param {object} props - properties from redux store
     */
    constructor(props){
        super(props)
        this.state = {
            files: undefined,
            sliderValue: process.env.REACT_APP_SLIDER_VALUE_NN
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    /**
     * This function updates the props.
     * @param {object} nextProps - properties from redux store
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.sliderValue !== this.state.sliderValue && nextProps.sliderValue !== undefined) {
            this.setState({sliderValue: nextProps.sliderValue});
        }
    }

    /**
     * This function opens the image upload dialog.
     * @param {object} e - click event
     */
    handleShow(e){
        e.preventDefault();
        const {showImageUploadDialogAction} = this.props;
        showImageUploadDialogAction();
    }

    /**
     * This function closes the image upload dialog.
     */
    handleClose(){
        const {hideImageUploadDialogAction} = this.props;
        hideImageUploadDialogAction();
    } 

    /**
     * This function submits the uploaded images and uploads them. 
     * If only one image was uploaded the crop dialog will be shown.
     * @param {object} e - click event
     */
    handleSubmit(e){
        e.preventDefault();
        const files = this.state.files;
        if (files=== undefined){
            return
        }
        if (files.length === 1){
            const {showImageCropDialogAction} = this.props;
            showImageCropDialogAction();
        }
        else {
            const {imageUploadAction} = this.props;
            console.log("handleSubmit images from form: ");
            console.log(this.state.files)

            const formData = new FormData();
            for(let i = 0; i < files.length; i++) {
                formData.append(`images[${i}]`, files[i]);
            }
            formData.append("k", this.state.sliderValue)
            imageUploadAction(formData);
        }
    }

    /**
     * This function stores the selected images in the state.
     * @param {object} e 
     */
    async handleSelect(e){ 
        const {sendFilesToStoreAction} = this.props;
        sendFilesToStoreAction(e.target.files)

        this.setState({files: e.target.files}, () => {
            console.log("[ImageUploadButton] Files in state: " + JSON.stringify(this.state.files));
        })
    }

    /**
     * This function renders the image upload button and modal dialog.
     * @returns {object} - React component
     */
    render(){
        var showDialog = this.props.showImageUploadDialog
        if(showDialog === undefined){
            showDialog = false;
        }

        var pending = this.props.pending;
        if(pending === undefined){
            pending = false;
        }

        var error = this.props.error;
        if(error === undefined){
            error = false;
        }

        var crop = this.state.files && this.state.files.length === 1;
       
        return (
            <div id="navButton">
                <Button variant="outline-success" onClick={this.handleShow}>
                    Upload Image
                </Button>

                <Modal show={showDialog} onHide={this.handleClose}>
                    <Modal.Header id="uploadHeader" closeButton>
                        <Modal.Title id="uploadTitel">Image Upload</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="uploadBody">
                        <Form>
                            <Form.Group>
                                <label for='fileUpload'></label>
                                <input id='fileUpload' type='file' onChange={this.handleSelect} multiple />
                            </Form.Group>
                            <Button id='uploadSubmit' variant="outline-success" onClick={this.handleSubmit}>
                                Submit
                            </Button>
            
                            {error && <Form.Label style={{ color: "red" }}> Something went wrong.</Form.Label>}
                            {pending && <Spinner animation="border" style={{ color: "grey" }} size="sm" />}
                        </Form>
                    </Modal.Body>
                </Modal>
                {crop && <CropButton cropfile={this.state.files[0]}></CropButton> }
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showImageUploadDialogAction: imageUploadActions.getShowImageUploadDialogAction,
    hideImageUploadDialogAction: imageUploadActions.getHideImageUploadDialogAction,
    showImageCropDialogAction: imageUploadActions.getShowImageCropDialogAction,
    imageUploadAction: imageUploadActions.imageUpload,
    sendFilesToStoreAction: imageUploadActions.getSendFilesToStoreAction
},dispatch)

const connectedUploadButton = connect(mapStateToProps, mapDispatchToProps)(ImageUploadButton);
export default connectedUploadButton;


