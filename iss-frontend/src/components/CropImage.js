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
import axios from "axios"
import * as route from '../config/Routes'


const mapStateToProps = state => {
    return state
}

class CropImage extends Component {

    constructor(props){
        super(props)
        this.state = {
            files: undefined,
            sliderValue: process.env.REACT_APP_SLIDER_VALUE_NN,
            crop: { x: 0, y: 0 },
            cropsize: undefined,
            zoom: 1,
            aspect: undefined,
            imagetocrop: this.props.cropfile,
            url: undefined,
            newFile: undefined,
            croppedimage: undefined,
            croppedFile: undefined, 
            croppedAreaPixels: {},
            pending: true
          
        };
        this.handleShowCrop = this.handleShowCrop.bind(this);
        this.handleCloseCrop = this.handleCloseCrop.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // change to componentDidUpdate later!
    componentWillReceiveProps(nextProps) {
        if (nextProps.files[0] !== this.state.imagetocrop && nextProps.files[0] !== undefined) {
            this.setState({imagetocrop: nextProps.files[0]})
            this.setState({url: URL.createObjectURL(nextProps.files[0]), pending: false })
        }
    }

    componentDidMount(){
        axios({
            method: "GET",
            url: route.FETCH_IMAGE_SIZE
        })
        .then(response => {
            if(response.status === 200){
                let { width, height } = response.data
                width = +width
                height = +height
                let cropsize = { "width": width, "height": height }
                let aspect = width / height
                this.setState({cropsize: cropsize, aspect: aspect})
            }
        })
        let file = this.props.files[0]
        this.setState({imagetocrop: file})
        this.setState({url: URL.createObjectURL(file), pending: false })
    }          

    onCropChange = (crop) => {
        this.setState({ crop: crop })
    }
    
    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({croppedAreaPixels: croppedAreaPixels})
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

        const { croppedAreaPixels, cropsize } = this.state

        const canvas = document.createElement('canvas');
        canvas.width = cropsize.width;
        canvas.height = cropsize.height;
        const ctx = canvas.getContext('2d');

        let img = new Image(this.state.cropsize.width, this.state.cropsize.height);
        let { url } = this.state
        img.src = url
        img.decode()
            .then(() => {
                ctx.drawImage(
                    img,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    cropsize.width,
                    cropsize.height
                );
        
                const croppedUrl =  canvas.toDataURL(this.props.files[0].type);
                
                fetch(croppedUrl)
                    .then(response => {
                        response.blob()
                            .then(blob => {
                                
                                const newFile = new File([blob], this.props.files[0].name, {type: blob.type});
                                sendFilesToStoreAction([newFile], "single")
                                console.log("Cropped File zum Hochladen:", newFile)
              
                                const formData = new FormData();
                                formData.append(`image[${newFile}]`, newFile);
                                formData.append("k", this.state.sliderValue)
                                imageUploadAction(formData);
                                this.setState({imagetocrop: undefined})
                            })
                    })
            })
    }


    render(){

        var showCropDialog = this.props.showImageCropDialog
        if(showCropDialog === undefined){
            showCropDialog = false;
        }

        var pending = this.state.pending;
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
                        <div className="modal-dialog-crop">
                            <div className="crop-container" >
                                {!pending &&
                                <Cropper
                                    image={this.state.url}
                                    crop={this.state.crop}
                                    zoom={this.state.zoom}
                                    aspect={this.state.aspect}
                                    cropsize={this.state.cropsize}
                                    onCropChange={this.onCropChange}
                                    onCropComplete={this.onCropComplete}
                                    onZoomChange={this.onZoomChange} />
                                }
                            </div>
                        </div> 
                    </Modal.Body>
                     
                    <Modal.Footer className="justify-content-center">
                        <div className="controls container-fluid">
                            <Slider
                                value={this.state.zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e, zoom) => this.onZoomChange(zoom)}
                                /*classes={{ container: 'slider' }}*/ />
                        </div>   
                        <Button className="cropsubmit" variant="dark" onClick={this.handleSubmit}>Submit</Button>
                        {error && <Form.Label style={{ color: "red" }}> Something went wrong.</Form.Label>}
                        {pending && <Spinner animation="border" style={{ color: "grey" }} size="sm" />}
                    </Modal.Footer>
                </Modal>
            
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showImageCropDialogAction: imageUploadActions.getShowImageCropDialogAction,
    hideImageCropDialogAction: imageUploadActions.getHideImageCropDialogAction,
    imageUploadAction: imageUploadActions.imageUpload,
    sendFilesToStoreAction: imageUploadActions.getSendFilesToStoreAction,
},dispatch)


const cropButton = connect(mapStateToProps, mapDispatchToProps)(CropImage);
export default cropButton;