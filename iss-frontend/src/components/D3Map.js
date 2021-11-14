import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import * as d3 from 'd3';

const mapStateToProps = state => {
    return state;
}

class D3Map extends Component {

    constructor(props){
        super(props);
        this.state = {
            images: this.props.imagesToDisplay
        }
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
    }

    render(){
        return(
            <div ref="canvas"></div>
        )

    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
},dispatch)

const connectedD3Map = connect(mapStateToProps, mapDispatchToProps) (D3Map);
export default connectedD3Map;