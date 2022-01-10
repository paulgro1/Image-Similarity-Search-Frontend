import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Slider from '@material-ui/core/Slider'
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
            file: null,
           // showcropmodal: false,
           //Testbild 
           // imageSrc: 'https://de.babor.com/content/application/database/files/0/19568//stage-trockene-haut.jpg'
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShowCrop = this.handleShowCrop.bind(this);
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



    onCropChange = (crop) => {
        this.setState({ crop })
      }
    
      onCropComplete = (croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
      }
    
      onZoomChange = (zoom) => {
        this.setState({ zoom })
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


    handleCloseCrop(){
        const {hideImageCropDialogAction} = this.props;
        hideImageCropDialogAction();
    }

    handleShowCrop(e){
        e.preventDefault();
        const {showImageCropDialogAction} = this.props;
        showImageCropDialogAction();
    }

    //Funktion wird aufgerufen, falls nur 1 Image hochgeladen wird 
    //Soll einzelnes Image, welches gecropppt werden soll, in Modaldialog anzeigen
    handleShowSingleImageCrop(e){
       // e.preventDefault();
         const {showImageCropDialogAction} = this.props;
         showImageCropDialogAction();
        const {files} = this.state;
        if (files && files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
               this.setState({
                  file: e.target.files
               });
            };
            //Bild im Modaldialog anzeigen lassen- funktioniert noch nicht 
            reader.readAsDataURL(files[0]);
         }
         }


//Ggf. zusätzliche Submitfunktion für gecropptes Single Image, oder Switch?
    handleSubmit(e){
        e.preventDefault();
        const files = this.state.files;
        if (files.length === 1){
            console.log(files)
            this.handleShowSingleImageCrop(files);
        }
        else {
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

        var showCropDialog = this.props.showImageCropDialog
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
                        <Button variant="dark" onClick={this.handleSubmit}>
                            Submit
                        </Button>
                        {error && <Form.Label style={{ color: "red" }}> Something went wrong.</Form.Label>}
                        {pending && <Spinner animation="border" style={{ color: "grey" }} size="sm" />}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
        
        
        <div>
             <Modal show={this.showCropDialog} onHide={this.handleCloseCrop}>
                    <Modal.Header closeButton>
                        <Modal.Title>Crop and Upload Single Image</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form> 
 
                   <div class="modal-body">
                       <img id="file" src={this.state.file}/></div> 
                          
                            <div className="crop-container">
                                <Cropper
                                    image={this.state.file}
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


    )
}
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showImageUploadDialogAction: imageUploadActions.getShowImageUploadDialogAction,
    hideImageUploadDialogAction: imageUploadActions.getHideImageUploadDialogAction,
    showImageCropDialogAction: imageUploadActions.getShowImageCropDialogAction,
    hideImageCropDialogAction: imageUploadActions.getHideImageCropDialogAction,
    imageUploadAction: imageUploadActions.imageUpload,
    sendFilesToStoreAction: imageUploadActions.getSendFilesToStoreAction
},dispatch)

const connectedUploadButton = connect(mapStateToProps, mapDispatchToProps)(ImageUploadButton);
export default connectedUploadButton;
