import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import * as d3 from 'd3';

import '../layout/css/style.css'
import '../layout/css/D3MapStyle.css'

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
            xAxis: undefined,
            yAxis: undefined,
            clickActive: false,
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setValue = this.setValue.bind(this);
        this.getNearestNeighbours = this.getNearestNeighbours.bind(this);
        this.handleUploadedImages = this.handleUploadedImages.bind(this);
        this.storeImageUrls = this.storeImageUrls.bind(this);
        this.setClickActive = this.setClickActive.bind(this);
    }

    

    async getNearestNeighbours(id, k) {
        var nearestNeighbours  = await fetchImagesActions.fetchNearestNeighbours(id, k)
        var nearestNeighboursArray = []
        for (let i=0; i < k; i++){
            var nearestNeighbour = {
                id: nearestNeighbours.ids[0][i],
                distances: nearestNeighbours.distances[i],
                similarities: nearestNeighbours.similarities[0][i],
                url: 'http://localhost:8080/images/thumbnails/' + nearestNeighbours.ids[0][i]
            }
            nearestNeighboursArray.push(nearestNeighbour)
        }
        return nearestNeighboursArray;
    }

    async componentDidMount() {
        var imagesMeta = await fetchImagesActions.fetchAllThumbnailMeta()
        var IMAGES = []
        for (const imageMeta of imagesMeta){
      
            let image = {
                id: imageMeta.id,
                filename: imageMeta.filename,
                url: 'http://localhost:8080/images/thumbnails/' + imageMeta.id,
                x: imageMeta.x,
                y: imageMeta.y,
                width: 12,
                height: 16
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

        this.setState({selectedImageId: e.id});
        if(parseInt(e.id) >= this.state.IMAGES.length){
            this.setState({selectedImageUrl: e.url})
        } else {
            this.setState({selectedImageUrl: 'http://localhost:8080/images/'+ e.id});
        }
        this.setState({selectedImageFilename: e.filename});

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
                nearestNeighboursArray.push(nearestNeighbour)
            }
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
                x: uploadedImages.coordinates[i][0],
                y: uploadedImages.coordinates[i][1],
            }
            newImages.push(image)
        }
        this.drawMap(this.state.IMAGES, newImages);
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

    setClickActive(value){
        this.setState({clickActive: value});
    }

    removeMark(){
        if(this.state.clickActive === true) {
            d3.selectAll('image')
            .classed('highlight', false)
            .classed('hide', false)
            .classed('highlight_neighbour', false)
            this.setState({ clickActive: false })
        }
        else{
            return
        }
        
    }

    async markImage(image, id, Canvas) {
        if(this.props.sliderValue !== undefined){
            this.setState({sliderValue: this.props.sliderValue});
        }
        
        let nearestNeighbours  = await fetchImagesActions.fetchNearestNeighbours(parseInt(image.id), this.state.sliderValue)
            let nearestNeighboursArray = []
            for (let i=0; i < this.state.sliderValue; i++){
                let nearestNeighbour = {
                    id: nearestNeighbours.ids[0][i],
                }
                nearestNeighboursArray.push(nearestNeighbour)
            }

        if (this.state.clickActive === false) {
            // hide all images
            d3.selectAll('image').classed('hide', true)

            /* mark clicked Image */
            d3.select('#image_' + image.id)
            .classed('highlight', true)
            .classed('hide', false)
            .classed('highlight_neighbour', false)
            

            /* mark next neighbours */
            for ( let neighbour of nearestNeighboursArray) {
                d3.select('#image_' + neighbour.id)
                .classed('highlight', false)
                .classed('hide', false)
                .classed('highlight_neighbour', true)
          
            }
            /* set State */
            this.setState({ clickActive: true })

        } else {
            Canvas.selectAll('image')
            .classed('hide', false)
            .classed('highlight', false)
            .classed('highlight_neighbour', false)
            this.setState({ clickActive: false })
        }
    }
    

    drawMap(data, newImages) {
        if(this.state.uploadedImages){
            addImages(newImages, this.state.xAxis, this.state.yAxis)
        } else {
            var margin = {top: 10, right: 30, bottom: 30, left: 60}
            var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - margin.left - margin.right
            var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - margin.top - margin.bottom
            var k = 1
            var tick_amount = 10
                
            var svgCanvas = d3.select(this.refs.canvas)
                .append('svg')
                    .attr('id', 'canvas-svg')
                    .attr('width', canvasWidth)
                    .attr('height', canvasHeight)
                    

                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    

                // x-Axis
                var x = d3.scaleLinear()
                    .domain([-50, 60])
                    .range([ 0, canvasWidth ])  
                var xAxis = svgCanvas.append("g")
                    .call(d3.axisBottom(x).ticks(tick_amount))
                    
                xAxis.select(".domain")
                    .attr("stroke-width","0")
                    
                this.setState({xAxis: x})
                // y-Axis
                var y = d3.scaleLinear()
                    .domain([-60, 40])
                    .range([ canvasHeight, 0]);
                var yAxis = svgCanvas.append("g")
                    .call(d3.axisLeft(y).ticks(tick_amount));

                yAxis.select(".domain")
                    .attr("stroke-width","0")
                    
                this.setState({yAxis: y})

                // Add a clipPath: everything out of this area won't be drawn.
                svgCanvas
                    .append("defs")
                    .append("SVG:clipPath")
                    .attr("id", "clip")
                    .append("SVG:rect")
                    .attr("width", canvasWidth )
                    .attr("height", canvasHeight )
                    .attr("x", 0)
                    .attr("y", 0)
                    

                // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
                var zoom = d3.zoom()
                .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
                .extent([[0, 0], [canvasWidth, canvasHeight]])
                .on("zoom", updateChart)    

                // Create the scatter variable: where both the circles and the brush take place
                var scatter = svgCanvas.append('g')
                    .attr('id', 'scatter')
                    .attr("clip-path", "url(#clip)")
                    

                // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
                scatter.append("rect")
                    .attr("width", canvasWidth)
                    .attr("height", canvasHeight)
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .on("click", function() {
                        this.removeMark(svgCanvas)                
                    }.bind(this))
                
                scatter.selectAll('image')
                    .data(data)
                    .enter()
                    .append('image')
                    .attr('id',image => "image_" +  image.id)
                    .attr('filename', image => image.filename)
                    .attr('xlink:href', image => image.url)
                    .attr('x', function(image) {return x(image.x)})
                    .attr('y', function(image) {return y(image.y)})
                    .attr('width', image => image.width)
                    .attr('height', image => image.height)
                    .classed('hide', false)
                    .classed('highlight', false)
                    .classed('highlight_neighbour', false)
                    /* mark next neighbours */
                    .on("click", function(click,image) {
                        this.markImage(click, image, svgCanvas, d3);
                    }.bind(this))
                    /* open information-view */
                    .on("dblclick", function(e) {
                        this.handleShow(e);
                    }.bind(this))
                    
                    scatter.call(zoom)
            }  
                // A function that updates the chart when the user zoom and thus new boundaries are available
                function updateChart() {
                    k = d3.event.transform.k
                    // recover the new scale
                    var newX = d3.event.transform.rescaleX(x);
                    var newY = d3.event.transform.rescaleY(y);
                   
                    // update axes with these new boundaries
                    xAxis.call(d3.axisBottom(newX).ticks(tick_amount))
                    yAxis.call(d3.axisLeft(newY).ticks(tick_amount))

                    // update image position
                    scatter.selectAll("image")
                        .attr('x', function(image) {return newX(image.x)})
                        .attr('y', function(image) {return newY(image.y)})  
                    
                    scatter.selectAll("image")
                        .attr('width', 12*k)
                        .attr('height', 16*k)
                }

                function addImages(data, x, y){
                    var scatter = d3.select('#scatter')
                    .append('svg')
                    
                    scatter.selectAll('image')
                        .data(data)
                        .enter()
                        .append('image')
                        .attr('id', image => "image_" + image.id)
                        .attr('filename', image => image.filename)
                        .attr('xlink:href', image => image.url)
                        .attr('x', function(image) {return x(image.x)})
                        .attr('y', function(image) {return y(image.y)})
                        .attr('width', 12)
                        .attr('height', 16)
                        .classed('hide', false)
                        .classed('highlight', false)
                        .classed('highlight_neighbour', false)
                        /* mark next neighbours */
                        .on("click", function(click,image) {
                            this.markImage(click, image, scatter);
                        }.bind(this))
                        /* open information-view */
                        .on("dblclick", function(e) {
                            this.handleShow(e);
                        }.bind(this)) 
                }
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