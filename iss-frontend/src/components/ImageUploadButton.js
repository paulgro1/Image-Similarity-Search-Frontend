import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as imageUploadActions from '../actions/ImageUploadActions';


const mapStateToProps = state => {
    return state
}

class ImageUploadButton extends Component {

    constructor(props){
        super(props)
        this.state = {
            files: undefined,
            sliderValue: 30
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    /*  // change to componentDidUpdate later!
    componentWillReceiveProps(nextProps) {
        if (nextProps.sliderValue !== this.state.sliderValue && nextProps.sliderValue !== undefined) {
            this.setState({sliderValue: nextProps.sliderValue});
        }
    } */

    handleShow(e){
        e.preventDefault();
        const {showImageUploadDialogAction} = this.props;
        showImageUploadDialogAction();
    }

    handleClose(){
        const {hideImageUploadDialogAction} = this.props;
        hideImageUploadDialogAction();
    } 

    handleSubmit(e){
        e.preventDefault();
        const {files} = this.state;
        const {imageUploadAction} = this.props;
        console.log("handleSubmit images from form: ");
        console.log(this.state.files)

        const formData = new FormData();
        for(let i = 0; i < files.length; i++) {
            console.log(files[i])
            
            formData.append(`images[${i}]`, files[i]);
        }
        
        formData.append("k", this.state.sliderValue)
        imageUploadAction(formData);
    }

    async handleSelect(e){
        const {sendFilesToStoreAction} = this.props;
        console.log(e.target.files);
        sendFilesToStoreAction(e.target.files)
        this.setState({files: e.target.files}, () => {
            console.log("[ImageUploadButton] Files in state: " + JSON.stringify(this.state.files));
        })
    }

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

        return (
            <div>
                <Button variant="outline-success" onClick={this.handleShow}> 
                    Upload Image 
                </Button>

                <Modal show={showDialog} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Image Upload</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <input type='file' onChange={this.handleSelect} multiple/>
                            </Form.Group>
                            <Button variant="primary" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                            {error && <Form.Label style={{color: "red"}}> Something went wrong. </Form.Label>}
                            {pending && <Spinner animation="border" style={{color: "grey"}} size="sm"/>}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showImageUploadDialogAction: imageUploadActions.getShowImageUploadDialogAction,
    hideImageUploadDialogAction: imageUploadActions.getHideImageUploadDialogAction,
    imageUploadAction: imageUploadActions.imageUpload,
    sendFilesToStoreAction: imageUploadActions.getSendFilesToStoreAction
},dispatch)

const connectedUploadButton = connect(mapStateToProps, mapDispatchToProps)(ImageUploadButton);
export default connectedUploadButton;
