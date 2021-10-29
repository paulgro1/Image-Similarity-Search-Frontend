import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../layout/css/style.css'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container'

import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

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
        images = [{url: "../../testImages/1.jpg"},{url: "../../testImages/2.jpeg"},{url: "../../testImages/3.jpeg"}]

        if(images){
            imageItem = <div classname="card-columns">
                <Container>
                <Row>
                {   
                    images.map(image => {
                        // var imagePath = "../../images/posts/" + image.url;
                        var imagePath = image.url
                        return(
                            <Col xs={8} md={6} lg={3} className="card-columns">
                                <Card className="single-card">
                                    <Card.Header>
                                    </Card.Header>
                                    <Card.Body className="card-body">
                                        <Image src={imagePath} width="100%" height="100%"/>
                                    </Card.Body>
                                    <Card.Footer>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>
            </Container>
            </div>
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