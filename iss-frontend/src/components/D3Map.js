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
            sliderValue: 5
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    async componentDidMount() {
        var imagesMeta = await fetchImagesActions.fetchImagesMeta()
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
        this.drawMap(IMAGES);
    }

    handleShow(e){
        this.setState({selectedImageId: e.target.getAttribute("id")});
        this.setState({selectedImageUrl: e.target.getAttribute("href")});
        this.setState({selectedImageFilename: e.target.getAttribute("filename")});
        if(this.props.sliderValue !== undefined){
            this.setState({sliderValue: this.props.sliderValue});
        }
        const {showInformationDialogAction} = this.props;
        showInformationDialogAction();
    }

    handleClose(){
        const {hideInformationDialogAction} = this.props;
        hideInformationDialogAction();

    } 

    setValue(value){
        this.setState({sliderValue: value});
    }

    drawMap(data) {
        const canvasHeight = 800
        const canvasWidth = 1860
        const svgCanvas = d3.select(this.refs.canvas)
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style("border", "1px solid black")
        
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

    render(){

        var showDialog = this.props.showInformationDialog
        if(showDialog === undefined){
            showDialog = false;
        }


        /**
         * just for testing purposes
         */
        var similarImages = []
        for (let i = 0; i < this.state.sliderValue; i++){
            similarImages.push({
                url: "../../testImages/leo.png"
            })
        }

        return(
            <div ref="canvas">
                <Modal show={showDialog} onHide={this.handleClose} size="lg" scrollable={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Informations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col lg={4}>
                                    <Image src={'http://localhost:8080/images/' + this.state.selectedImageId} width={192} height={256}/>
                                </Col>
                                <Col lg={8}>
                                    <h3>Top {this.state.sliderValue} Similar Images:</h3>
                                    The number under the image shows the euclidean distance to the selected image. <br/>
                                    <br/>
                                    <div id="image-container">
                                        {similarImages.map(img => {
                                            var url = img.url

                                            return (
                                                <div>
                                                    <Image src={url}/> <br/>
                                                    34
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