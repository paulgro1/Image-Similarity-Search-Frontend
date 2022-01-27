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
            sliderValue: 5
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setValue = this.setValue.bind(this);
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

    setValue(value){
        this.setState({sliderValue: parseInt(value)});
    }

    handleSave(e){
        e.preventDefault();
        const {setValueAction} = this.props;
        setValueAction(this.state.sliderValue);
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
                            onChange={changeEvent => this.setValue(changeEvent.target.value)}
                            min={0}
                            max={30}
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
    setValueAction: settingsActions.setSliderValue
},dispatch)

const connectedSettingsButton = connect(mapStateToProps, mapDispatchToProps)(SettingsButton);
export default connectedSettingsButton;
