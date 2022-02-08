import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import * as d3 from 'd3';

import '../layout/css/style.css'
import '../layout/css/markStyle.css'
import '../layout/css/legendStyle.css'
import '../layout/css/infoViewStyle.css'

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
import * as settingsActions from '../actions/SettingsActions'


const mapStateToProps = state => {
    return state;
}

/**
 * Class representing the d3 map component.
 * @prop {object} files - uploaded images
 * @prop {function} setSessionToken - sets the token for current session
 * @prop {function} showInformationDialogAction - shows modal dialog
 * @prop {function} hideInformationDialogAction - hides modal dialog
 *
 * @extends {Component}
 */
class D3Map extends Component {
    
    /**
     * Create a D3Map component.
     * @param {object} props - properties from redux store
     */
    constructor(props){
        super(props);
        this.state = {
            selectedImageId: undefined,
            selectedImageCluster: undefined,
            selectedImageUrl: undefined,
            selectedImageFilename: undefined,
            sliderValue: 5,
            nearestNeighbours: undefined,
            allNearestNeighbours: undefined,
            uploadedImages: undefined,
            uploadedImagesCount: 0,
            lastUploadedImagesCount: 0,
            uploadedImagesUrls: [],
            IMAGES: undefined,
            xAxis: undefined,
            yAxis: undefined,
            newX: undefined,
            newY: undefined,
            imgScale: 1,
            clickActive: false,
            sessionToken: undefined,
            clusterCenterValue: undefined,
            clusterActive: undefined,
            openInfoView: false,
            markedImagesIDs: [],
            markedImages: [],
            markedUploadedImage: undefined,
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getNearestNeighbours = this.getNearestNeighbours.bind(this);
        this.handleUploadedImages = this.handleUploadedImages.bind(this);
        this.storeImageUrls = this.storeImageUrls.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.handleUploadedNearestN = this.handleUploadedNearestN.bind(this);
        this.markImage = this.markImage.bind(this);
        this.markImageD3 = this.markImageD3.bind(this);
        this.handleExcelExport = this.handleExcelExport.bind(this);
    }

    /**
     * This function fetches k nearest neighbours for one image.
     * @param {number} id - image id
     * @param {number} k - slider value
     * @returns {object} - nearest neighbours
     */
    async getNearestNeighbours(id, k) {
        var nearestNeighbours  = await fetchImagesActions.fetchNearestNeighbours(id, k, this.state.sessionToken)
        fetchImagesActions.fetchMultipleThumbnails(this.state.sessionToken, nearestNeighbours.ids[0], function(imageUrls){
            Promise.all(imageUrls).then(function(nearestNeighbourURLs){
            var urls = []
            for(let i in nearestNeighbourURLs){
                urls[nearestNeighbourURLs[i].thumbnailId] = nearestNeighbourURLs[i].url
            }
            var nearestNeighboursArray = []
            for (let i=0; i < k; i++){
                var nearestNeighbour = {
                    id: nearestNeighbours.ids[0][i],
                    filename: nearestNeighbours.filenames[0][i],
                    clusterCenter: nearestNeighbours.clusterCenters[0][i],
                    distances: nearestNeighbours.distances[0][i],
                    similarities: nearestNeighbours.similarities[0][i],
                    url: urls[nearestNeighbours.ids[0][i]]
                }
                nearestNeighboursArray.push(nearestNeighbour)
        }
        this.setState({nearestNeighbours: nearestNeighboursArray})
        return nearestNeighboursArray
        }.bind(this))
    }.bind(this))
    }

    /**
     * This function is called when the component first mounts.
     * It handels the session token and initializes the d3 map.
     */
    async componentDidMount() {
        await authenticationActions.getSessionToken(function(sessionToken){
            if (sessionToken) {
            console.log("Token for this session: " + sessionToken)
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
                var clusterCenterValues = []
                for(var i = 0; i < imagesMeta.length; i++) {
                    var clusterCenter = imagesMeta[i].clusterCenter
                    let image = {
                        id: imagesMeta[i].id,
                        filename: imagesMeta[i].filename,
                        url: imageUrls[i],
                        x: imagesMeta[i].x,
                        y: imagesMeta[i].y,
                        clusterCenter: imagesMeta[i].clusterCenter,
                        thumbnailSize: imagesMeta[i].thumbnailSize,
                        width: 12,
                        height: 16,
                        uploaded: false
                    }
                    IMAGES.push(image)
                    if (clusterCenterValues.indexOf(clusterCenter) === -1) {
                        clusterCenterValues.push(clusterCenter)
                    }          

                }        
                this.setState({IMAGES: IMAGES})
                this.drawMap(IMAGES);
            }.bind(this))
        }.bind(this));
    }

    /**
     * This function updates the props.
     * @param {object} nextProps - properties from redux store
     */
    async componentWillReceiveProps(nextProps) {
        if (nextProps.uploadedImages !== this.state.uploadedImages && nextProps.uploadedImages !== undefined) { 
            await this.setState({uploadedImages: nextProps.uploadedImages})
            this.handleUploadedImages();
        }
        if (nextProps.sliderValue !== this.state.sliderValue && nextProps.sliderValue !== undefined) {
            this.setState({sliderValue: nextProps.sliderValue});
        }
        if (nextProps.clusterCenterValue !== this.state.clusterCenterValue && nextProps.clusterCenterValue !== undefined) {
            this.setState({clusterCenterValue: nextProps.clusterCenterValue});
        }
        if (nextProps.clusterActive !== this.state.clusterActive && nextProps.clusterActive !== undefined) {
            this.setState({clusterActive: nextProps.clusterActive});
        }
        if (nextProps.images !== this.state.IMAGES && nextProps.images !== undefined) {
            this.setState({IMAGES: nextProps.images});
        }       

    }

    /**
     * This function handels the nearest neighbours for an uploaded image.
     * @returns {object} - nearest neighbours of the uploaded image
     */
    async handleUploadedNearestN(callback){
            // handle uploaded image case
            var id = parseInt(this.state.selectedImageId) - this.state.IMAGES.length;
            var newId
            console.log("Id of uploaded image: " + id)
            if(this.state.uploadedImages.ids.length === 1){
                newId = 0
            } else {
                newId = id - this.state.uploadedImagesCount
            }
            var nN = {
                ids: this.state.uploadedImages.ids[newId],
                filenames: this.state.uploadedImages.filenames[newId],
                nnIds: this.state.uploadedImages.nnIds[newId],
                nnFilenames: this.state.uploadedImages.nnFilenames[newId],
                similarities: this.state.uploadedImages.similarities[newId],
                distances: this.state.uploadedImages.distances[newId],
                clusterCenters: this.state.uploadedImages.nnClusterCenters[newId],
            }
            await fetchImagesActions.fetchMultipleThumbnails(this.state.sessionToken, nN.nnIds, function(imageUrls){
                Promise.all(imageUrls).then(function(nearestNeighbourURLs){
                    var urls = []
                    for(let i in nearestNeighbourURLs){
                        urls[nearestNeighbourURLs[i].thumbnailId] = nearestNeighbourURLs[i].url
                    }
                    var nearestNeighboursArray = []
                    for (let i=0; i < this.state.sliderValue; i++){
                        var nearestNeighbour = {
                            id: nN.nnIds[i],
                            filename: nN.nnFilenames[id],
                            distances: nN.distances[i],
                            similarities: nN.similarities[i],
                            url: urls[nN.nnIds[i]],
                            clusterCenter: nN.clusterCenters[i],
                        }
                        nearestNeighboursArray.push(nearestNeighbour)
                    }
                    this.setState({nearestNeighbours: nearestNeighboursArray});
                    return callback(nearestNeighboursArray)
                }.bind(this))
        }.bind(this))
    }

    /**
     * This function opens the information dialog.
     * @param {object} e - click event
     */
    async handleShow(e){
        const {showInformationDialogAction} = this.props;
        console.log("Informationview for image with the id: " + e.id)
        this.setState({selectedImageId: e.id});
        if(parseInt(e.id) >= this.state.IMAGES.length){
            this.setState({selectedImageUrl: e.url})
        } else {
            var fullsizeURL = await fetchImagesActions.fetchOneImage(e.id, this.state.sessionToken)
            this.setState({selectedImageUrl: fullsizeURL});
        }
        this.setState({selectedImageFilename: e.filename});
        this.setState({selectedImageCluster: e.clusterCenter});
        if(parseInt(this.state.selectedImageId) >= this.state.IMAGES.length){
            this.handleUploadedNearestN(function(){
                return
            });
            showInformationDialogAction();
        } else {
            await this.getNearestNeighbours(this.state.selectedImageId, this.state.sliderValue)
            showInformationDialogAction();
        } 
    }

    /**
     * This function hides the information dialog.
     */
    handleClose(){
        const {hideInformationDialogAction} = this.props;
        hideInformationDialogAction();

    } 

    /**
     * This function handels the Excel export.
     * It defines the data and filename for the spreadsheed.
     */
    handleExcelExport(){
        const fileName = this.state.selectedImageFilename + '_' + this.state.sliderValue + '_NN';
        var clusterCenter = this.state.selectedImageCluster;
        var data = []
        if(clusterCenter === undefined){
            data = [
                [this.state.sliderValue + ' nearest neighbours of image: ' + this.state.selectedImageFilename],
                ['Image Id: ' + this.state.selectedImageId],
                [],
                ['NN Id','NN Filename', 'NN Cluster Center', 'Euclidean Distance', 'Similarity in %'],
            ]
        } else {
            data = [
                [this.state.sliderValue + ' nearest neighbours of image: ' + this.state.selectedImageFilename],
                ['Image Id: ' + this.state.selectedImageId],
                ['Cluster Center: ' + this.state.selectedImageCluster],
                [],
                ['NN Id','NN Filename', 'NN Cluster Center', 'Euclidean Distance', 'Similarity in %'],
            ]
        }
        
        for(let img of this.state.nearestNeighbours){
            let dataRow = []
            dataRow.push(img.id)
            dataRow.push(img.filename)
            dataRow.push(img.clusterCenter)
            dataRow.push(img.distances)
            dataRow.push((img.similarities * 100).toFixed(2))
            data.push(dataRow)
        }
        this.exportToSpreadsheet(data, fileName)
    } 

    /**
     * This function exports the spreadsheed.
     * Source: https://medium.com/an-idea/export-excel-files-client-side-5b3cc5153cf7
     * @param {object} data - data for the spreadsheet
     * @param {string} fileName - name for Excel file
     */
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

    /**
     * This function handels the uploaded images.
     * @returns - returns nothing if there are no uploaded images.
     */
    async handleUploadedImages(){
        var files = this.props.files;
        var uploadedImages = this.state.uploadedImages
        if(uploadedImages === undefined){
            return;
        }

        if(files){
            this.storeImageUrls(files);
        }
        this.setState({uploadedImagesCount: this.state.uploadedImagesCount + this.state.lastUploadedImagesCount})
        this.setState({lastUploadedImagesCount: this.state.uploadedImages.ids.length})

        var newImages = []
        for(let i = 0; i < files.length; i++){
            let image = {
                id: uploadedImages.ids[i],
                filename: uploadedImages.filenames[i],
                url: this.state.uploadedImagesUrls[i],
                x: uploadedImages.coordinates[i][0],
                y: uploadedImages.coordinates[i][1],
                uploaded: true,
            }
            newImages.push(image)
        }
        this.drawMap(this.state.IMAGES, newImages);
    }

    /**
     * This function generates URLs for the uploaded images and sets them in the state.
     * @param {object} files - uploaded images
     */
    storeImageUrls(files){
        const imageFiles = files; 
        const filesLength = imageFiles.length;
        var imageUrls = [];
        for(var i = 0; i < filesLength; i++) {
            imageUrls.push(URL.createObjectURL(files[i])) 
        }
        this.setState({ uploadedImagesUrls: imageUrls });
    } 

    /**
     * This function sets the slider value.
     */
    setValue(value){
        this.setState({sliderValue: value});
    }

    /**
     * This function removes a mark from an image.
     * @returns - nothing if markActive in state is false
     */
    async removeMark(){
        //show uploaded again
        if(this.state.uploadedImages !== undefined) {
            for(let id of this.state.uploadedImages.ids) {
                d3.select('#image_' + id)
                .classed('highlight_uploaded', true)
            }
        }

        if(this.state.markActive === true) {
            d3.selectAll('image')
            .classed('highlight', false)
            .classed('hide', false)
            .classed('highlight_neighbour', false)
            .classed('hide_off', true)
            .classed('hide_on', false)

            if(this.props.clusterActive) {
                this.props.images.forEach(image => {
                const element = document.getElementById("image_" + image.id)
                element.classList.add('cluster' + image.clusterCenter)
            })
        }
            this.setState({ markActive: false })
            this.setState({ openInfoView: false })
            const {setMarkActiveAction} = this.props
            await setMarkActiveAction(this.state.markActive,this.state.markedImagesIDs)
        }

        else{
            return
        }
    }

    /**
     * This function handles the highlighting of images.
     * @param {object} image - selected image
     * @param {number} id - id of selected image
     * @param {object} canvas - d3 canvas object
     */
    async markImage(image, id, canvas) {
        this.setState({selectedImageId: image.id});

        if(this.state.markActive === undefined){
            this.setState({markActive: false});
        }

        if(this.state.sliderValue !== undefined){
            this.setState({sliderValue: this.state.sliderValue});
        }
        var nearestNeighboursArray = []
        if(this.state.markActive === false) {  
            if(image.uploaded){
                this.handleUploadedNearestN(function(nearestNeighboursArray){ 
                    this.markImageD3(nearestNeighboursArray, image, id, canvas)
                }.bind(this))
            }
            else{  
                var nearestNeighbours  = await fetchImagesActions.fetchNearestNeighbours(parseInt(image.id), this.state.sliderValue, this.state.sessionToken)
                for (let i=0; i < this.state.sliderValue; i++){
                    let nearestNeighbour = {
                        id: nearestNeighbours.ids[0][i],
                    }
                    nearestNeighboursArray.push(nearestNeighbour)
                }
                this.markImageD3(nearestNeighboursArray, image, id, canvas)
            }
        }
        else{
            this.markImageD3(nearestNeighboursArray, image, id, canvas)
        }
    }

        /**
        * This function handles the highlighting of images.
        * @param {object} nearestNeighboursArray - array of the NearestNeighbours, of the selected image
        * @param {object} image - selected image
        * @param {number} id - id of selected image
        * @param {object} canvas - d3 canvas object
        */
        async markImageD3(nearestNeighboursArray, image, id, canvas){
            if(this.state.openInfoView === false) {
                const markedImagesIDArray = []

                if(image.uploaded){
                    this.setState({markedUploadedImage: image})
                }
                
                markedImagesIDArray.push(parseInt(id))
                for(let image of nearestNeighboursArray) {
                    let id = parseInt(image.id)
                    markedImagesIDArray.push(id)
                }
                this.setState({ markedImagesIDs: markedImagesIDArray})
    
                if (this.state.markActive === false) {

                    if(this.state.clusterActive) {
                        // show clusterMark from markedImages and hide from others
                        this.state.IMAGES.forEach(cluster_image => {
                            if(markedImagesIDArray.includes(cluster_image.id)) {
                                const element = document.getElementById("image_" + cluster_image.id)
                                element.classList.add('cluster' + cluster_image.clusterCenter)
                                if(image.uploaded){
                                    const element = document.getElementById("image_" + markedImagesIDArray[0])
                                    element.classList.remove('cluster' + this.state.IMAGES[markedImagesIDArray[0]].clusterCenter)
                                }
                            }
                            else {
                                const element = document.getElementById("image_" + cluster_image.id)
                                element.classList.remove('cluster' + cluster_image.clusterCenter)
                            }
                        })
                    
                    } else {
                        this.state.IMAGES.forEach(image => {
                            const element = document.getElementById("image_" + image.id)
                            element.classList.remove('cluster' + image.clusterCenter)
                        })
                    }
    
                    // hide all images
                    d3.selectAll('image')
                    .classed('hide_on', true)
                    .classed('hide_off', false)
    
                    // hide uploaded images
                    if(this.state.uploadedImages !== undefined) {
                        for(let id of this.state.uploadedImages.ids) {
                            d3.select('#image_' + id)
                            .classed('highlight_uploaded', false)
                        }
                    }
                    
                    /* mark clicked Image */
                    d3.select('#image_' + image.id)
                    .classed('highlight', true)
                    .classed('hide_on', false)
                    .classed('hide_off', false)
                    .classed('highlight_neighbour', false)
                    .classed('highlight_uploaded', false) 
        
                    /* mark next neighbours */
                    for ( let neighbour of nearestNeighboursArray) {
                        d3.select('#image_' + neighbour.id)
                        .classed('highlight', false)
                        .classed('hide_on', false)
                        .classed('hide_off', false)
                        .classed('highlight_neighbour', true)
                    }
                    
                    /* set State + props */
                    this.setState({ markActive: true })
                    this.setState({ openInfoView: true })
                    const {setMarkActiveAction} = this.props
                    await setMarkActiveAction(this.state.markActive, this.state.markedImagesIDs)
                    
        
                } else {
                    
                    canvas.selectAll('image')
                    .classed('hide', false)
                    .classed('highlight', false)
                    .classed('highlight_neighbour', false)
                    .classed('hide_off', true)
                    .classed('hide_on', false)
                    this.setState({ markActive: false })
    
                    //if cluster is active show clustermark after remove imageMark
                    if(this.state.clusterActive) {
                        this.props.IMAGES.forEach(image => {
                        const element = document.getElementById("image_" + image.id)
                        element.classList.add('cluster' + image.clusterCenter)
                    })
                }
                }
            }
            else {
                const ids = this.state.markedImagesIDs
                if(ids.includes(id)) {
                    this.handleShow(image)
                }
    
                else {
                    this.removeMark() 
                }
            }        
        }
    

    /**
     * This function draws the d3 map.
     * @param {object} data - images which should be displayed on the map
     * @param {object} newImages - if new images were uploaded: uploaded images, otherwise: undefined
     */
    drawMap(data, newImages) {
        if(this.state.uploadedImages){
            addImages(newImages, this.markImage, this.state)
        } else {
            var margin = {top: 10, right: 30, bottom: 30, left: 60}
            var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - margin.left - margin.right
            var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - margin.top - margin.bottom
            var k = 1
            var tick_amount = 10
                
            var svgCanvas = d3.select(this.refs.canvas)
                .append('svg')
                    .attr('id', 'canvas-svg')
                    .attr("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`)
                    .attr("preserveAspectRatio", "xMinYMin meet")
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
                .scaleExtent([.1, 80])  // This control how much you can unzoom (x0.5) and zoom (x20)
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
                    .attr('clusterCenter', image => image.clusterCenter)
                    .classed('hide', false)
                    .attr('uploaded', image => image.uploaded)
                    .classed('hide_on', false)
                    .classed('hide_off', true)
                    .classed('highlight', false)
                    .classed('highlight_neighbour', false)
                    /* mark next neighbours */
                    .on("click", function(click, image) {
                        this.markImage(click, image, svgCanvas);
                    }.bind(this))       
            scatter.call(zoom)
        }  

        /** 
         * This function updates the chart when the user zoom and thus new boundaries are available.
        */
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

        /** 
         * This function includes uploaded images in the d3 map.
         * @param {object} data - uploaded images
         * @param {function} markImage - function to highlight images
         * @param {object} state - current state
        */
        function addImages(data, markImage, state){
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
                .attr('uploaded', image => image.uploaded)
                .classed('hide_on', false)
                .classed('hide_off', true)
                .classed('highlight', false)
                .classed('highlight_neighbour', false)
                .classed('highlight_uploaded', true) 
                /* mark next neighbours */
                .on("click", function(click,image) {
                    markImage(click, image, scatter);
                }) 
        } 

        /** 
         * This function removes previously uploaded images from the d3 map.
        */
        function removeUploadedImages(){
            d3.select('#uploadedImages')
                .remove()
        }
    }

    /**
     * This function renders the d3 map (canvas) and the modal dialog with the detailed informations
     * about an image and the nearest neighbours.
     * @returns {object} - React component
     */
    render(){
        
        var showDialog = this.props.showInformationDialog
        if(showDialog === undefined){
            showDialog = false;
        }

        var similarImages = []

        if(this.state.nearestNeighbours){
            similarImages = this.state.nearestNeighbours;
        }

        var selectedCluster = []
        for(let i=0; i < this.state.clusterCenterValue; i++) {
            var clusterValue = "cluster" + i 
            var clusterLegendItem = <li key={clusterValue} id={clusterValue}>Cluster-ID: {i}</li>
            selectedCluster.push(clusterLegendItem) 
        }

        var showCluster = this.props.showCluster
        if(showCluster === undefined) {
            showCluster = false
        }
        
        
        return(  
            <div>  
                <div className="canvasBody" id="canvas" ref="canvas">
                    <Modal show={showDialog} onHide={this.handleClose} size="lg" scrollable={false}>
                        <Modal.Header id="infoHeader" closeButton>
                            <Modal.Title id="infoTitle">Information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body id="infoBody" >
                            <Container id="infoContainer">
                                <Row id="firstRow">
                                    <Col id="imageData" height={300} lg={4}>
                                        <Image src={this.state.selectedImageUrl} width={192}/>
                                        <h4>Image Properties:</h4>
                                        <div>
                                            Filename: {this.state.selectedImageFilename}<br/>
                                            {/* Cluster Center: {this.state.selectedImageClusterCenter} */}
                                            <Button id="exportButton" variant="outline-success" onClick={this.handleExcelExport}>
                                            Export Data
                                        </Button>
                                        </div> 
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
                                <Row id="secondRow"></Row>      
                            </Container>
                        </Modal.Body>
                    </Modal>
                </div>
                    <div id='legend'>
                        <h4>Information:</h4>
                        
                        <div id="marks" key="marks">
                            <h5>Neighbours: {this.state.sliderValue}</h5>
                            <li id='selected'>selected Image</li>
                            <li id='neighbours'>next Neighbours</li>
                            <li id='uploaded'>uploaded Image(s)</li>
                        </div>
                        <div id="cluster">
                            <h5>Cluster: {this.state.clusterCenterValue}</h5>
                            {selectedCluster}
                        </div>
                    </div>
                </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showInformationDialogAction: fetchImagesActions.showInformationDialogAction,
    hideInformationDialogAction: fetchImagesActions.hideInformationDialogAction,
    setSessionToken: authenticationActions.setSessionToken,
    getImagesMetaFromDbAction: fetchImagesActions.getImagesMetaFromDb,
    setClusterValueAction: settingsActions.setClusterCenterValue,
    setClusterSwitchAction: settingsActions.setClusterSwitch,
    setMarkActiveAction: settingsActions.setMarkActive
},dispatch)

const connectedD3Map = connect(mapStateToProps, mapDispatchToProps) (D3Map);
export default connectedD3Map;