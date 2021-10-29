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
            file: {}
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

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
        const {file} = this.state;
        const {imageUploadAction} = this.props;
        console.log("handleSubmit image from form: " + file.name);

        const formData = new FormData();
        formData.append("img", file, file.name);

        imageUploadAction(this.props.token, formData);
    }

    /*
    * Note: I guess you could upload multiple files by removing [0] (?)
    */
    handleSelect(e){
        this.setState({file: e.target.files[0]}, () => {
            console.log("[ImageUploadButton] Files in state: " + this.state.file);
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
                                <input type='file' onChange={this.handleSelect}/>
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
    imageUploadAction: imageUploadActions.imageUpload
},dispatch)

const connectedUploadButton = connect(mapStateToProps, mapDispatchToProps)(ImageUploadButton);
export default connectedUploadButton;
