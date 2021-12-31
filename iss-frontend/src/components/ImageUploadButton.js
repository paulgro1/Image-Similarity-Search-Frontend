import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Slider from '@material-ui/core/Slider'
import Image from 'react-bootstrap/Image';
import Cropper from 'react-easy-crop'
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
            sliderValue: 5,
            crop: { x: 336, y: 448 },
            zoom: 1,
            aspect: 4 / 3,
            imageSrc: 'https://de.babor.com/content/application/database/files/0/19568//stage-trockene-haut.jpg'
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleShowCrop = this.handleShowCrop.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseCrop = this.handleCloseCrop.bind(this);
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


    handleShowCrop(e){
        e.preventDefault();
        const {files} = this.state;
        const {showImageCropDialogAction} = this.props;
        showImageCropDialogAction();
    }

    handleCloseCrop(){
        const {hideImageCropDialogAction} = this.props;
        hideImageCropDialogAction();
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

        var showCropDialog = this.props.showImageCropDialogAction
        if(showCropDialog === undefined){
            showCropDialog = false;
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
            <><div>
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
                            <input type='file' onChange={this.handleSelect} multiple />
                        </Form.Group>
                        <Button variant="dark" onClick={this.handleShowCrop}>
                            Open
                        </Button>
                        {error && <Form.Label style={{ color: "red" }}> Something went wrong.</Form.Label>}
                        {pending && <Spinner animation="border" style={{ color: "grey" }} size="sm" />}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div><div>
                <Modal show={showCropDialog} onHide={this.handleCloseCrop}>
                    <Modal.Header closeButton>
                        <Modal.Title>Crop and Upload Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form> 
                        {/*  <Image src={this.state.selectedImageUrl} width={400} height={450}/> */}
                            <center><Image src={this.state.selectedImageUrl} width={400} height={450}/></center>
                            <div className="crop-container">
                                <Cropper
                                    image={this.state.imageSrc}
                                    crop={this.state.crop}
                                    zoom={this.state.zoom}
                                    aspect={this.state.aspect}
                                    onCropChange={this.onCropChange}
                                    onCropComplete={this.onCropComplete}
                                    onZoomChange={this.onZoomChange} />
                            </div>
                            <div className="controls">
                                <Slider
                                    value={this.state.zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e, zoom) => this.onZoomChange(zoom)}
                                    classes={{ container: 'slider' }} />
                            </div>
                            <center><Button variant="dark" onClick={this.handleSubmit}>
                                Submit
                            </Button></center>
                            {error && <Form.Label style={{ color: "red" }}> Something went wrong.</Form.Label>}
                            {pending && <Spinner animation="border" style={{ color: "grey" }} size="sm" />}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div></>






/* <div>
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
                            Open
                        </Button>
                        {error && <Form.Label style={{color: "red"}}> Something went wrong. </Form.Label>}
                        {pending && <Spinner animation="border" style={{color: "grey"}} size="sm"/>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div> */







    )
}
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showImageUploadDialogAction: imageUploadActions.getShowImageUploadDialogAction,
  //  showImageCropDialogAction: imageUploadActions.getShowImageCropDialogAction,
    hideImageUploadDialogAction: imageUploadActions.getHideImageUploadDialogAction,
    hideImageCropDialogAction: imageUploadActions.getHideImageCropDialogAction,
    imageUploadAction: imageUploadActions.imageUpload,
    sendFilesToStoreAction: imageUploadActions.getSendFilesToStoreAction
},dispatch)

const connectedUploadButton = connect(mapStateToProps, mapDispatchToProps)(ImageUploadButton);
export default connectedUploadButton;
