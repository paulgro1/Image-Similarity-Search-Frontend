import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import * as d3 from 'd3';

import '../layout/css/style.css'
import '../layout/css/D3MapStyle.css'

import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import * as fetchImagesActions from '../actions/FetchImagesActions'
import * as authenticationActions from '../actions/AuthenticationActions'
import { X } from 'react-bootstrap-icons';
import add from 'd3-quadtree/src/add';

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
            allNearestNeighbours: undefined,
            uploadedImages: undefined,
            uploadedImagesUrls: [],
            IMAGES: undefined,
            xAxis: undefined,
            yAxis: undefined,
            newX: undefined,
            newY: undefined,
            imgScale: 1,
            clickActive: false,
            sessionToken: undefined
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setValue = this.setValue.bind(this);
        this.getNearestNeighbours = this.getNearestNeighbours.bind(this);
        this.handleUploadedImages = this.handleUploadedImages.bind(this);
        this.storeImageUrls = this.storeImageUrls.bind(this);
        this.setClickActive = this.setClickActive.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.handleUploadedNearestN = this.handleUploadedNearestN.bind(this);
        this.markImage = this.markImage.bind(this);
        this.handleExcelExport = this.handleExcelExport.bind(this);
    }

    async getNearestNeighbours(id, k) {
        var nearestNeighbours  = await fetchImagesActions.fetchNearestNeighbours(id, k, this.state.sessionToken)
        var nearestNeighboursArray = []
        for (let i=0; i < k; i++){
            var nearestNeighbour = {
                id: nearestNeighbours.ids[0][i],
                filename: nearestNeighbours.filenames[0][i],
                clusterCenter: nearestNeighbours.clusterCenters[0][i],
                distances: nearestNeighbours.distances[0][i],
                similarities: nearestNeighbours.similarities[0][i],
                url: 'http://localhost:8080/images/thumbnails/' + nearestNeighbours.ids[0][i]
            }
            nearestNeighboursArray.push(nearestNeighbour)
        }
        return nearestNeighboursArray;
    }

    async componentDidMount() {
        await authenticationActions.getSessionToken(function(sessionToken){
            if (sessionToken) {
            console.log(sessionToken)
            const {setSessionToken} = this.props;
            this.setState({sessionToken: sessionToken})
            setSessionToken(sessionToken)
                axios.defaults.headers.common['Api-Session-Token'] = sessionToken;
            } else {
                axios.defaults.headers.common['Api-Session-Token'] = null;
            }
        }.bind(this))
        var imagesMeta =  await fetchImagesActions.fetchAllThumbnailMeta(this.state.sessionToken)
        fetchImagesActions.fetchAllThumbnails(this.state.sessionToken, function(imageUrls) {
            Promise.all(imageUrls).then(function(imageUrls){
                var IMAGES = []
                for(var i = 0; i < imagesMeta.length; i++) {
                    let image = {
                        id: imagesMeta[i].id,
                        filename: imagesMeta[i].filename,
                        url: imageUrls[i],
                        x: imagesMeta[i].x,
                        y: imagesMeta[i].y,
                        width: 12,
                        height: 16
                    }
                    IMAGES.push(image)
                }
                this.setState({IMAGES: IMAGES})
                this.drawMap(IMAGES);
            }.bind(this))
        }.bind(this));
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

    handleUploadedNearestN(){
            // handle uploaded image case
            var id = parseInt(this.state.selectedImageId) - this.state.IMAGES.length;
            console.log("Id of uploaded image: " + id)
            console.log(this.state.uploadedImages)
            var nN = {
                distances: this.state.uploadedImages.distances[id],
                ids: this.state.uploadedImages.ids[id],
                similarities: this.state.uploadedImages.similarities[id],
                filenames: this.state.uploadedImages.nnFilenames[id],
                clusterCenters: this.state.uploadedImages.nnClusterCenters[id],
            }

            var nearestNeighboursArray = [];
            for (let i=0; i < this.state.sliderValue; i++){
                var nearestNeighbour = {
                    id: nN.ids[i],
                    filename: nN.filenames[id],
                    distances: nN.distances[i],
                    similarities: nN.similarities[i],
                    url: 'http://localhost:8080/images/thumbnails/' + nN.ids[i],
                    clusterCenter: nN.clusterCenters[i],
                }
                nearestNeighboursArray.push(nearestNeighbour)
            }
            this.setState({nearestNeighbours: nearestNeighboursArray});
    }

    async handleShow(e){
        const {showInformationDialogAction} = this.props;
        console.log("In handleShow(): ")
        console.log(e)
        this.setState({selectedImageId: e.id});
        if(parseInt(e.id) >= this.state.IMAGES.length){
            this.setState({selectedImageUrl: e.url})
        } else {
            this.setState({selectedImageUrl: 'http://localhost:8080/images/'+ e.id});
        }
        this.setState({selectedImageFilename: e.filename});
        if(parseInt(this.state.selectedImageId) >= this.state.IMAGES.length){
            this.handleUploadedNearestN();
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

    handleExcelExport(){
        const fileName = this.state.selectedImageFilename + '_' + this.state.sliderValue + '_NN';
        var data = [
            [this.state.sliderValue + ' nearest neighbours of image: ' + this.state.selectedImageFilename],
            ['Image Id: ' + this.state.selectedImageId],
            ['Cluster Center: ' + 'TODO'],
            [],
            ['NN Id','NN Filename', 'NN Cluster Center', 'Euclidean Distance', 'Similarity in %'],
        ]
        for(let img of this.state.nearestNeighbours){
            console.log(img)
            let dataRow = []
            dataRow.push(img.id)
            dataRow.push(img.filename)
            dataRow.push(img.clusterCenter)
            dataRow.push(img.distances)
            dataRow.push((img.similarities * 100).toFixed(2))
            data.push(dataRow)
        }
        console.log(data)
        this.exportToSpreadsheet(data, fileName)
    } 

    //source: https://medium.com/an-idea/export-excel-files-client-side-5b3cc5153cf7
    exportToSpreadsheet (data, fileName) {
        const fileType ="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        //Create a new Work Sheet using the data stored in an Array of Arrays.
        const workSheet = XLSX.utils.aoa_to_sheet(data);
        // Generate a Work Book containing the above sheet.
        const workBook = {
          Sheets: { data: workSheet, cols: [] },
          SheetNames: ["data"],
        };
        // Exporting the file with the desired name and extension.
        const excelBuffer = XLSX.write(workBook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(fileData, fileName + fileExtension);
    };

    async handleUploadedImages(){
        var files = this.props.files;
        var uploadedImages = this.state.uploadedImages

        if(uploadedImages === undefined){
            return;
        }

        if(files){
            this.storeImageUrls(files);
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

        console.log(files)
        
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

    async markImage(image, id, Canvas, uploaded) {
        this.setState({selectedImageId: image.id});
        if(this.state.sliderValue !== undefined){
            this.setState({sliderValue: this.state.sliderValue});
        }

        if(uploaded){
            this.handleUploadedNearestN();
            var nearestNeighboursArray  = this.state.nearestNeighbours
        }
        else{
            var nearestNeighbours  = await fetchImagesActions.fetchNearestNeighbours(parseInt(image.id), this.state.sliderValue, this.state.sessionToken)
            var nearestNeighboursArray = []
            for (let i=0; i < this.state.sliderValue; i++){
                let nearestNeighbour = {
                    id: nearestNeighbours.ids[0][i],
                }
                nearestNeighboursArray.push(nearestNeighbour)
            }
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
            addImages(newImages, this.markImage, this.handleShow, this.state)
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
                    
                this.setState({xAxis: x, newX: x})
                // y-Axis
                var y = d3.scaleLinear()
                    .domain([-60, 40])
                    .range([ canvasHeight, 0]);
                var yAxis = svgCanvas.append("g")
                    .call(d3.axisLeft(y).ticks(tick_amount));

                yAxis.select(".domain")
                    .attr("stroke-width","0")
                    
                this.setState({yAxis: y, newY: y})


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
                .on("zoom", updateChart.bind(this))   

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
                
                // //Collision Detection D3 Quadtree
                // var tree = d3.quadtree()
                //     .x(x)
                //     .y(y)
                //     .extent([0, 0], [canvasWidth, canvasHeight])
                   

                // console.log(tree.data());

                // Raster wird erstellt und Zellen in Array gespeichert
                const cells = [];
                const n = (canvasWidth / 10) * (canvasHeight / 10);
                const squareWidth = canvasWidth / (canvasWidth / 10);
                let squareID = -1;
                for (let j = 0; j < canvasWidth; j + squareWidth) {
                    for (let k = 0; k < canvasHeight; k + squareWidth) {
                    cells.push(
                        new Square(j, j + squareWidth, k, k + squareWidth, squareID + 1)
                    );
                    }
                }

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
                    .attr("cellID", function(image){ calcCell(image)})
                    .classed('hide', false)
                    .classed('highlight', false)
                    .classed('highlight_neighbour', false)
                    // .each(function(image){add(tree, image.x, image.y)})
                    /* mark next neighbours */
                    .on("click", function(click,image) {
                        this.markImage(click, image, svgCanvas, false);
                    }.bind(this))
                    /* open information-view */
                    .on("dblclick", function(e) {
                        this.handleShow(e);
                    }.bind(this))
                    
                    // console.log(tree.data());

                    scatter.call(zoom)

            }  
                // A function that updates the chart when the user zoom and thus new boundaries are available
                function updateChart() {
                    k = d3.event.transform.k
                    // recover the new scale
                    var newX = d3.event.transform.rescaleX(x);
                    var newY = d3.event.transform.rescaleY(y);
                    
                    this.setState({newX: newX});
                    this.setState({newY: newY});
                    // update axes with these new boundaries
                    xAxis.call(d3.axisBottom(newX).ticks(tick_amount))
                    yAxis.call(d3.axisLeft(newY).ticks(tick_amount))
                    this.setState({imgScale: k});


                    // update image position
                    scatter.selectAll("image")
                        .attr('x', function(image) {return newX(image.x)})
                        .attr('y', function(image) {return newY(image.y)})  
                    
                    scatter.selectAll("image")
                        .attr('width', 12*k)
                        .attr('height', 16*k)
                }

                function addImages(data, markImage, handleShow, state){
                    var prevSvg = d3.select('#uploadedImages')
                    if(prevSvg !== null){
                        removeUploadedImages()
                    }

                    var scatter = d3.select('#scatter')
                        .append('svg')
                        .attr('id', 'uploadedImages')
                    
                    scatter.selectAll('image')
                        .data(data)
                        .enter()
                        .append('image')
                        .attr('id', image => "image_" + image.id)
                        .attr('filename', image => image.filename)
                        .attr('xlink:href', image => image.url)
                        .attr('x', function(image) {return state.newX(image.x)})
                        .attr('y', function(image) {return state.newY(image.y)})
                        .attr('width', 12 * state.imgScale)
                        .attr('height', 16 * state.imgScale)
                        .classed('hide', false)
                        .classed('highlight', false)
                        .classed('highlight_neighbour', false)
                        /* mark next neighbours */
                        .on("click", function(click,image) {
                            markImage(click, image, scatter, true);
                        })
                        /* Funktion zum öffnen der Informationsansicht */
                        .on("dblclick", function(e) {
                            handleShow(e);
                        }) 
                } 

                function removeUploadedImages(){
                    d3.select('#uploadedImages')
                        .remove()
                }

                //Funktion, um Quadtree nach allen Punkten in bestimmten Rechteck zu durchsuchen
                function search(quadtree, xmin, ymin, xmax, ymax) {
                    const results = [];
                    quadtree.visit((node, x1, y1, x2, y2) => {
                        if (!node.length) {
                        do {
                            let d = node.data;
                            if (d[0] >= xmin && d[0] < xmax && d[1] >= ymin && d[1] < ymax) {
                            results.push(d);
                            }
                        } while (node = node.next);
                        }
                        return x1 >= xmax || y1 >= ymax || x2 < xmin || y2 < ymin;
                    });
                    return results;
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
                                                <div key={url}>
                                                    <Image src={url}/> <br/>
                                                    {euclideanDistance.toFixed(2)} %
                                                </div>
                                            )
                                        })} 
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={4}>
                                    <h4>Image Properties:</h4>
                                    <div>
                                        Filename: {this.state.selectedImageFilename}<br/>
                                        {/* Cluster Center: {this.state.selectedImageClusterCenter} */}
                                    </div>
                                    <br></br> 
                                </Col>
                                <Col lg={8}>
                                    <Button variant="outline-success" onClick={this.handleExcelExport}>
                                        Export Data
                                    </Button>
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
    setSessionToken: authenticationActions.setSessionToken,
},dispatch)

const connectedD3Map = connect(mapStateToProps, mapDispatchToProps) (D3Map);
export default connectedD3Map;