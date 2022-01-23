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
import '../layout/css/style.css'


const mapStateToProps = state => {
    return state
}

class CropImage extends Component {

    constructor(props){
        super(props)
        this.state = {
            files: undefined,
            sliderValue: 5,
            crop: { x: 0, y: 0 },
            cropsize: { width: 336, height: 448 },
            zoom: 1,
            aspect: 336 / 448,
            imagetocrop: this.props.cropfile,
            url: undefined,
            newFile: undefined,
            croppedimage: undefined,
            croppedFile: undefined, 
            croppedAreaPixels: {}
          
        };
        this.handleShowCrop = this.handleShowCrop.bind(this);
        this.handleCloseCrop = this.handleCloseCrop.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    canvas = {}



   componentDidMount(){
        let file = this.state.imagetocrop
        this.setState({url: URL.createObjectURL(file) })
    }          


    onCropChange = (crop) => {
        this.setState({ crop: crop })
      }
    
      onCropComplete = (croppedArea, croppedAreaPixels) => {
        let img = new Image();
        img.src = this.state.selectedImageURL;
        const croppedX = this.state.url.width * croppedAreaPixels.x / 100;
        const croppedY = this.state.url.height * croppedAreaPixels.y / 100;
        const croppedWidth = this.state.url.width * croppedAreaPixels.width / 100;
        const croppedHeight = this.state.url.height * croppedAreaPixels.height / 100;
    
        const canvas = document.createElement('canvas');
        canvas.width = croppedWidth;
        canvas.height = croppedHeight;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
          img,
          croppedX,
          croppedY,
          croppedWidth,
          croppedHeight,
          0,
          0,
          croppedWidth,
          croppedHeight
        );

        const croppedUrl =  canvas.toDataURL('image/jpeg');

        const urlToObject= async()=> {
        const response = await fetch(croppedUrl);
            
        const blob = await response.blob();
        const newFile = new File([blob], 'image.jpg', {type: blob.type});
        this.state.croppedFile = newFile;
 
      }
    }
    
      onZoomChange = (zoom) => {
        this.setState({ zoom })
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



    handleSubmit(e){
        e.preventDefault();
        const {sendFilesToStoreAction} = this.props;
        const {imageUploadAction} = this.props;
        console.log("handleSubmit images from form: ");
        const croppedFile = this.state.croppedFile;
      
        console.log("Cropped File zum Hochladen:", croppedFile)
      
        const formData = new FormData();
        formData.append(`image[${croppedFile}]`, croppedFile);
        formData.append("k", this.state.sliderValue)
        imageUploadAction(formData);
}


    render(){

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
          
             <Modal show={showCropDialog} onHide={this.handleCloseCrop} >
                    
                    <Modal.Header closeButton>
                        <Modal.Title>Crop and Upload Single Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                   <div class="modal-dialog-crop">

                            <div className="crop-container" >
                                <Cropper
                                    image={this.state.url}
                                    crop={this.state.crop}
                                    zoom={this.state.zoom}
                                    aspect={this.state.aspect}
                                    cropsize={this.state.cropsize}
                                    onCropChange={this.onCropChange}
                                    onCropComplete={this.onCropComplete}
                                    onZoomChange={this.onZoomChange} />
                            </div>
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

                    </Modal.Body>
                    <center><Button class="cropsubmit" variant="dark" onClick={this.handleSubmit}>
                                Submit
                            </Button></center>
                           
                            
                            {error && <Form.Label style={{ color: "red" }}> Something went wrong.</Form.Label>}
                            {pending && <Spinner animation="border" style={{ color: "grey" }} size="sm" />}
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            
    )
}
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showImageCropDialogAction: imageUploadActions.getShowImageCropDialogAction,
    hideImageCropDialogAction: imageUploadActions.getHideImageCropDialogAction,
    imageUploadAction: imageUploadActions.imageUpload,
    sendFilesToStoreAction: imageUploadActions.getSendFilesToStoreAction
},dispatch)


const cropButton = connect(mapStateToProps, mapDispatchToProps)(CropImage);
export default cropButton;