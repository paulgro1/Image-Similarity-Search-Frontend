import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import * as d3 from 'd3';

import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import RangeSlider from 'react-bootstrap-range-slider';


import * as fetchImagesActions from '../actions/FetchImagesActions'

const mapStateToProps = state => {
    return state;
}

class D3Map extends Component {

    constructor(props){
        super(props);
        this.state = {
            images: this.props.imagesToDisplay,
            selectedImage: {},
            sliderValue: 15
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    componentDidMount() {
        var IMAGES = []
        for (let i = 0; i <= 100; i++){
            IMAGES.push({
                url: "../../testImages/leo.png", 
                x: 1300 * Math.random(), 
                y: 500 * Math.random()
            })
        }
        this.drawMap(IMAGES);
    }

    handleShow(e){
        this.setState({selectedImage: e.target.getAttribute("href")});
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
        const canvasHeight = 600
        const canvasWidth = 1400
        const svgCanvas = d3.select(this.refs.canvas)
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style("border", "1px solid black")
        
            svgCanvas.selectAll('image')
            .data(data)
            .enter()
            .append('image')
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
                <Modal show={showDialog} onHide={this.handleClose} size="lg" scrollable={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Informations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col lg={3}>
                                    <Image src={this.state.selectedImage} />
                                </Col>
                                <Col lg={9}>
                                    <h3>Image Properties:</h3>
                                    <div>
                                        Name: leo.png<br/>
                                        URL: {this.state.selectedImage}<br/>
                                        Size: xMB<br/>
                                    </div>
                                    <br></br>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={3}>
                                    <RangeSlider
                                    value={this.state.sliderValue}
                                    onChange={changeEvent => this.setValue(changeEvent.target.value)}
                                    min={0}
                                    max={30}
                                    />
                                </Col>
                                <Col lg={9}>
                                    <h3>Top {this.state.sliderValue} Similar Images:</h3>
                                    <Container>
                                            <Row>
                                                {
                                                    similarImages.map(img => {
                                                        var url = img.url

                                                        return(
                                                            <Col>
                                                                <Image src={url} />
                                                            </Col>
                                                        )
                                                    })
                                                }
                                            </Row>
                                    </Container>
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
},dispatch)

const connectedD3Map = connect(mapStateToProps, mapDispatchToProps) (D3Map);
export default connectedD3Map;