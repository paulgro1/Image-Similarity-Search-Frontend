import React, {Component} from 'react';

import Tooltip from "@material-ui/core/Tooltip";
import Button from 'react-bootstrap/Button';
import { Download } from "react-bootstrap-icons";

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as fetchImagesActions from '../actions/FetchImagesActions'

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import '../layout/css/HeaderStyle.css'

const mapStateToProps = state => {
    return state
}

/**
 * Class representing the export button component.
 * @extends {Component}
 */
class ExportButton extends Component {

    /**
     * Create a ExportButton component.
     * @param {object} props - properties from redux store
     */
    constructor(props){
        super(props)
        this.state = {
            sliderValue: 5,
            allNearestNeighbours: undefined,
            imageIds: undefined
        };
        this.getAllNearestNeighbours = this.getAllNearestNeighbours.bind(this);
        this.handleExcelExportAllImages = this.handleExcelExportAllImages.bind(this);
    }

    /**
     * This function updates the props.
     * @param {object} nextProps - properties from redux store
     */
    async componentWillReceiveProps(nextProps) {
        if (nextProps.sliderValue !== this.state.sliderValue && nextProps.sliderValue !== undefined) {
            this.setState({sliderValue: nextProps.sliderValue});
        }
    }

    /**
     * This function is called when the component first mounts.
     * It handels the session token and initializes the d3 map.
     */
    async componentDidMount(){
        const imageIds = await fetchImagesActions.fetchAllImagesIds()
        this.setState({imageIds: imageIds})
    }

    /**
     * This function fetches k nearest neighbours for all image.
     * @param {number} k - slider value
     */
    async getAllNearestNeighbours(k){
        var nearestNeighbours  = await fetchImagesActions.fetchAllNearestNeighbours(k)
        this.setState({allNearestNeighbours: nearestNeighbours});
    }

    /**
     * This function handels the Excel export of all images.
     * If there are more than 100 images, the function will split
     * the images into chunks of 100 and sends the request to the backend.
     * It defines the data and filename for the spreadsheed.
     */
    async handleExcelExportAllImages(){
        var imgIds = this.state.imageIds;
        if(imgIds.length < 100){
            await this.getAllNearestNeighbours(this.state.sliderValue);
        } else {
            
            //Send requests to backend in chunks of max. 100 ids.
            var perChunk = 100;
            var result = imgIds.reduce((resultArray, item, index) => { 
                const chunkIndex = Math.floor(index/perChunk);
                if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [] // start a new chunk
                }
                resultArray[chunkIndex].push(item);
                return resultArray;
            }, [])

            // Combine all responses from backend into one array.
            var allNN = [];
            for(let i=0; i<result.length; i++){
                var idChunk = result[i]
                var nearestNeighbours = await fetchImagesActions.fetchNearestNeighboursWithIds(this.state.sliderValue, idChunk)
                allNN.push(nearestNeighbours)
            }
            var mergedNN = [].concat.apply([], allNN);
            this.setState({allNearestNeighbours: mergedNN})
        }
        
        const fileName = 'all_images_' + this.state.sliderValue + '_NN';
        var data = [
            [this.state.sliderValue + ' nearest neighbours of all images.'],
            [],
            ['Image Id','Filename', 'Cluster Center', 'NN Id', 'NN Filename', 'NN Cluster Center', 'Euclidean Distance', 'Similarity in %'],
        ]
        for(let img of this.state.allNearestNeighbours){
            for(let i=0; i<this.state.sliderValue; i++){
                let dataRow = []
                dataRow.push(img.id)
                dataRow.push(img.filename)
                dataRow.push(img.cluster_center)
                dataRow.push(img.neighbour_ids[i])
                dataRow.push(img.neighbour_filenames[i])
                dataRow.push(img.neighbour_cluster_centers[i])
                dataRow.push(img.distances[i])
                dataRow.push((img.similarities[i] * 100).toFixed(2))
                data.push(dataRow)
            }   
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
     * This function renders the export button.
     * @returns {object} - React component
     */
    render(){
        return (
            
            <Tooltip id="tooltip" title="Export to excel" placement="bottom">
                <div id="navButton">
                    <Button variant="outline-success" onClick={this.handleExcelExportAllImages}> 
                        <Download/>
                    </Button>
                </div>
            </Tooltip>
                
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchAllImagesIds: fetchImagesActions.fetchAllImagesIds,
},dispatch)

const connectedExportButton = connect(mapStateToProps, mapDispatchToProps)(ExportButton);
export default connectedExportButton;
