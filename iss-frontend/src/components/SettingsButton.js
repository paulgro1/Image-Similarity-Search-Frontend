import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import RangeSlider from 'react-bootstrap-range-slider';
import { Gear } from "react-bootstrap-icons";

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as settingsActions from '../actions/SettingsActions';


const mapStateToProps = state => {
    return state
}

class SettingsButton extends Component {

    constructor(props){
        super(props)
        this.state = {
            sliderValue: 5,
            clusterCenterValue: 5,
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setNeighboursValue = this.setNeighboursValue.bind(this);
        this.setClustersValue = this.setClustersValue.bind(this)
        this.handleSave = this.handleSave.bind(this);
    }

    handleShow(e){
        e.preventDefault();
        const {showSettingsDialogAction} = this.props;
        showSettingsDialogAction();
    }

    handleClose(){
        const {hideSettingsDialogAction} = this.props;
        hideSettingsDialogAction();
    } 

    setNeighboursValue(value){
        this.setState({sliderValue: value});
    }

    setClustersValue(value){
        this.setState({clusterCenterValue: value});
    }

    handleSave(e){
        e.preventDefault();
        const {setValueAction} = this.props;
        setValueAction(this.state.sliderValue);
        const {sessionToken} = this.props
        const {setClusterValueAction} = this.props
        setClusterValueAction(this.state.clusterCenterValue, sessionToken)
        this.handleClose();
    }

    render(){

        var showDialog = this.props.showSettingsDialog
        if(showDialog === undefined){
            showDialog = false;
        }

        return (
            <div>
                <Button variant="outline-success" onClick={this.handleShow}> 
                    <Gear/>
                </Button>

                <Modal show={showDialog} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Number of nearest neighbours: <br/>
                        <RangeSlider
                            value={this.state.sliderValue}
                            onChange={changeEvent => this.setNeighboursValue(changeEvent.target.value)}
                            min={0}
                            max={30}
                        />
                        <br/>
                        Number of Clustercenters: <br/>
                        <RangeSlider
                            value={this.state.clusterCenterValue}
                            onChange={changeEvent => this.setClustersValue(changeEvent.target.value)}
                            min={1}
                            max={15}
                        />
                        <br/>
                        <Button onClick={this.handleSave}>Save Changes</Button>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showSettingsDialogAction: settingsActions.getShowSettingsDialogAction,
    hideSettingsDialogAction: settingsActions.getHideSettingsDialogAction,
    setValueAction: settingsActions.setNeighboursSliderValue,
    setClusterValueAction: settingsActions.setClusterCenterValue

},dispatch)

const connectedSettingsButton = connect(mapStateToProps, mapDispatchToProps)(SettingsButton);
export default connectedSettingsButton;

