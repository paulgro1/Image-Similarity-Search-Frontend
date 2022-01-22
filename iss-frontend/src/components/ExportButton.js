import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import { Download } from "react-bootstrap-icons";

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as fetchImagesActions from '../actions/FetchImagesActions'

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const mapStateToProps = state => {
    return state
}

class ExportButton extends Component {

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

    // change to componentDidUpdate later!
    async componentWillReceiveProps(nextProps) {
        if (nextProps.sliderValue !== this.state.sliderValue && nextProps.sliderValue !== undefined) {
            this.setState({sliderValue: nextProps.sliderValue});
        }
    }

    async componentDidMount(){
        const imageIds = await fetchImagesActions.fetchAllImagesIds()
        this.setState({imageIds: imageIds})
    }

    async getAllNearestNeighbours(k){
        var nearestNeighbours  = await fetchImagesActions.fetchAllNearestNeighbours(k)
        this.setState({allNearestNeighbours: nearestNeighbours});
    }

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

    render(){
        return (
            <div>
                <Button variant="outline-success" onClick={this.handleExcelExportAllImages}> 
                    <Download/>
                </Button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchAllImagesIds: fetchImagesActions.fetchAllImagesIds,
},dispatch)

const connectedExportButton = connect(mapStateToProps, mapDispatchToProps)(ExportButton);
export default connectedExportButton;
