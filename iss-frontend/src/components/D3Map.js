import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import * as d3 from 'd3';

import '../layout/css/style.css'

import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import * as fetchImagesActions from '../actions/FetchImagesActions'

const mapStateToProps = state => {
    return state;
}

class D3Map extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedImageId: undefined,
            selectedImageUrl: undefined,
            selectedImageFilename: undefined,
            sliderValue: 5,
            nearestNeighbours: undefined,
            uploadedImages: undefined,
            uploadedImagesUrls: [],
            IMAGES: undefined,
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setValue = this.setValue.bind(this);
        this.getNearestNeighbours = this.getNearestNeighbours.bind(this);
        this.handleUploadedImages = this.handleUploadedImages.bind(this);
        this.storeImageUrls = this.storeImageUrls.bind(this);
    }

    async getNearestNeighbours(id, k) {
        var nearestNeighbours  = await fetchImagesActions.fetchNearestNeighbours(id, k)
        var nearestNeighboursArray = []
        console.log(nearestNeighbours)
        for (let i=0; i < k; i++){
            var nearestNeighbour = {
                id: nearestNeighbours.ids[0][i],
                distances: nearestNeighbours.distances[i],
                similarities: nearestNeighbours.similarities[0][i],
                url: 'http://localhost:8080/images/thumbnails/' + nearestNeighbours.ids[0][i]
            }
            console.log(nearestNeighbour)
            nearestNeighboursArray.push(nearestNeighbour)
        }
        return nearestNeighboursArray;
    }

    async componentDidMount() {
        var imagesMeta = await fetchImagesActions.fetchAllThumbnailMeta()
        var IMAGES = []
        for (const imageMeta of imagesMeta){
            var imageWidth = 96
            var imageHeight = 128
            let image = {
                id: imageMeta.id,
                filename: imageMeta.filename,
                url: 'http://localhost:8080/images/thumbnails/' + imageMeta.id,
                x: (imageMeta.x * 20) + 830 - (imageWidth / 2),
                y: (imageMeta.y * 20) + 400 - (imageHeight / 2),
            }
            IMAGES.push(image)
        }
        this.setState({IMAGES: IMAGES})
        this.drawMap(IMAGES);
    }

    // change to componentDidUpdate later!
    async componentWillReceiveProps(nextProps) {
        if (nextProps.uploadedImages !== this.state.uploadedImages) {
            await this.setState({uploadedImages: nextProps.uploadedImages})
            this.handleUploadedImages();
        }
        if (nextProps.sliderValue !== this.state.sliderValue && nextProps.sliderValue !== undefined) {
            this.setState({sliderValue: nextProps.sliderValue});
        }
    }

    async handleShow(e){
        const {showInformationDialogAction} = this.props;

        this.setState({selectedImageId: e.target.getAttribute("id")});
        if(parseInt(e.target.getAttribute("id")) >= this.state.IMAGES.length){
            this.setState({selectedImageUrl: e.target.getAttribute("href")})
        } else {
            this.setState({selectedImageUrl: 'http://localhost:8080/images/'+ e.target.getAttribute("id")});
        }
        this.setState({selectedImageFilename: e.target.getAttribute("filename")});

        if(this.props.sliderValue !== undefined){
            this.setState({sliderValue: this.props.sliderValue});
            console.log("SLIDER VALUE CHANGED")
        }
        // handle uploaded image case
        if(parseInt(this.state.selectedImageId) >= this.state.IMAGES.length){
            var id = parseInt(this.state.selectedImageId) - this.state.IMAGES.length;
            console.log("Id of uploaded image: " + id)
            console.log(this.state.uploadedImages);
            var nN = {
                distances: this.state.uploadedImages.distances[id],
                ids: this.state.uploadedImages.ids[id],
                similarities: this.state.uploadedImages.similarities[id]
            }

            var nearestNeighboursArray = [];
            for (let i=0; i < nN.ids.length; i++){
                var nearestNeighbour = {
                    id: nN.ids[i],
                    distances: nN.distances[i],
                    similarities: nN.similarities[i],
                    url: 'http://localhost:8080/images/thumbnails/' + nN.ids[i]
                }
                console.log(nearestNeighbour)
                nearestNeighboursArray.push(nearestNeighbour)
            }
            console.log(nearestNeighboursArray)
            this.setState({nearestNeighbours: nearestNeighboursArray});
            showInformationDialogAction();

        } else {
            this.setState({nearestNeighbours: await this.getNearestNeighbours(this.state.selectedImageId, this.state.sliderValue)});
            showInformationDialogAction();
        } 
    }

    handleClose(){
        const {hideInformationDialogAction} = this.props;
        hideInformationDialogAction();

    } 

    async handleUploadedImages(){
        var files = this.props.files;
        var imageWidth = 96
        var imageHeight = 128
        var uploadedImages = this.state.uploadedImages

        if(uploadedImages === undefined){
            //TODO: remove old images from map
            return;
        }

        if(files){
            await this.storeImageUrls(files);
        }

        var newImages = []
        for(let i = 0; i < files.length; i++){
            let image = {
                id: this.state.IMAGES.length + i,
                filename: "uploaded_img",
                url: this.state.uploadedImagesUrls[i],
                x: (uploadedImages.coordinates[i][0] * 20) + 830 - (imageWidth / 2),
                y: (uploadedImages.coordinates[i][1] * 20) + 400 - (imageHeight / 2),
            }
            newImages.push(image)
        }
        this.updateMap(newImages)
    }

    storeImageUrls(files){
        const imageFiles = files; 
        const filesLength = imageFiles.length;
        
        var imageUrls = [];
        for(var i = 0; i < filesLength; i++) {
            imageUrls.push(URL.createObjectURL(files[i])) 
        }
        console.log(imageUrls)
        this.setState({ uploadedImagesUrls: imageUrls });
    } 

    setValue(value){
        this.setState({sliderValue: value});
    }

    drawMap(data) {
        const canvasHeight = 800
        const canvasWidth = 1860
        
        const svgCanvas = d3.select(this.refs.canvas)
            .append('svg')
            .attr('id', 'canvas-svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style("border", "1px solid black")
            //.classed('main-canvas', true) // in css datei mit .main-canvas ansprechen

        svgCanvas.selectAll('image')
            .data(data)
            .enter()
            .append('image')
            .attr('id', image => image.id)
            .attr('filename', image => image.filename)
            .attr('xlink:href', image => image.url)
            .attr('x', image => image.x)
            .attr('y', image => image.y)
            .on("click", function(e) {
                this.handleShow(e);
            }.bind(this))
        
    }

    // maxheight, maxwidth
    updateMap(data){
        console.log("Draw new images on map")
        console.log(data)
        
        d3.select('#canvas-svg')
            .selectAll('div')
            .data(data)
            .enter()
            .append('image')
            // thumbnail size: 128 x 96 px
            .attr('height', "128px") 
            .attr('width', "96px") 
            .attr('id', data => data.id)
            .attr('filename', data => data.filename)
            .attr('xlink:href', data => data.url)
            .attr('x', data => data.x)
            .attr('y', data => data.y)
            .on("click", function(e) {
                this.handleShow(e);
            }.bind(this))

    }

    render(){

        var showDialog = this.props.showInformationDialog
        if(showDialog === undefined){
            showDialog = false;
        }

        var similarImages = []
        if(this.state.nearestNeighbours){
            similarImages = this.state.nearestNeighbours;
            console.log("Similar Images: ")
            console.log(similarImages)
        }
        
        return(
            <div>
                <div ref="canvas">
                
                <Modal show={showDialog} onHide={this.handleClose} size="lg" scrollable={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Informations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col lg={4}>
                                    <Image src={this.state.selectedImageUrl} width={192} height={256}/>
                                </Col>
                                <Col lg={8}>
                                    <h3>Top {this.state.sliderValue} Similar Images:</h3>
                                    The number below the images shows the percentual similarity to the selected image based on the euclidean distance. <br/>
                                    <br/>
                                    <div id="image-container">
                                        {similarImages.map(img => {
                                            var url = img.url
                                            var euclideanDistance = img.similarities * 100

                                            return (
                                                <div>
                                                    <Image src={url}/> <br/>
                                                    {euclideanDistance.toFixed(2)} %
                                                </div>
                                            )
                                        })} 
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={9}>
                                    <h4>Image Properties:</h4>
                                    <div>
                                        Name: {this.state.selectedImageFilename}<br/>
                                    </div>
                                    <br></br> 
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
            </div>
            
        )

    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showInformationDialogAction: fetchImagesActions.showInformationDialogAction,
    hideInformationDialogAction: fetchImagesActions.hideInformationDialogAction,
    getImagesFromDbAction: fetchImagesActions.getImagesFromDb,
},dispatch)

const connectedD3Map = connect(mapStateToProps, mapDispatchToProps) (D3Map);
export default connectedD3Map;