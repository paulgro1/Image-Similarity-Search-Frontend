import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../layout/css/style.css'

import D3Map from './D3Map';

import * as fetchImagesActions from '../actions/FetchImagesActions'
import { bindActionCreators } from "redux";

const mapStateToProps = state => {
    return state;
}

class MainPage extends Component {

    constructor(props){
        super(props);
    }

    // ZUM TESTEN AUKOMMENTIERT
    /* componentDidMount() {
        const {getImagesFromDbAction} = this.props;
        getImagesFromDbAction();
    } */

    render() {
        var images = this.props.images
        //Note: "response" enthält ein Bild, falls eins vom User hochgeladen wurde
        var uploadedImage = this.props.response
        if(uploadedImage){
            //TODO: etwas mit dem hochgeladenen Bild tun
        }

        // ZUM TESTEN AUKOMMENTIERT
        /* if(!images || images.length === 0){ 
            return(
                <div classname="mainPage">
                    <p>No images found.</p>
                </div>
            )   
        } */

        let imageItem
        
        // NUR FÜR TESTZWECKE:
        images = [
            {url: "../../testImages/1.jpg", x: 0, y: 10},
            {url: "../../testImages/2.jpeg",  x: 200, y: 500},
            {url: "../../testImages/3.jpeg",  x: 700, y: 30}
        ]

        if(images){
            console.log("Vor Aufruf D3Map");
            return(
                {D3Map}
            )
        } else {
            imageItem = <p>No images could be found.</p>
        }
        return(
            <div>
                {imageItem}
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    getImagesFromDbAction: fetchImagesActions.getImagesFromDb,
},dispatch)

const connectedMainPage = connect(mapStateToProps, mapDispatchToProps) (MainPage);
export default connectedMainPage;