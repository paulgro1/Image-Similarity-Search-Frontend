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

/**
 * Class representing the settings button component.
 * @prop {function} showSettingsDialogAction - shows modal dialog
 * @prop {function} hideSettingsDialogAction - hides modal dialog
 * @prop {function} setValueAction - sets the slider value
 * 
 * @extends {Component}
 */
class SettingsButton extends Component {

    /**
     * Create a ImageUploadButton component.
     * @param {object} props - properties from redux store
     */
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

    /**
     * This function opens the settings dialog.
     * @param {object} e - click event
     */
    handleShow(e){
        e.preventDefault();
        const {showSettingsDialogAction} = this.props;
        showSettingsDialogAction();
    }

    /**
     * This function closes the image upload dialog.
     */
    handleClose(){
        const {hideSettingsDialogAction} = this.props;
        hideSettingsDialogAction();
    } 

    /**
     * This function sets the new slider value as an integer. 
     * @param {string} value - slider value
     */
    setValue(value){
        this.setState({sliderValue: parseInt(value)});
    }

    /**
     * This function saves the new slider value. 
     * @param {object} e - slider event
     */
    handleSave(e){
        e.preventDefault();
        const {setValueAction} = this.props;
        setValueAction(this.state.sliderValue);
        this.handleClose();
    }

    /**
     * This function renders the settings button and modal dialog.
     * @returns {object} - React component
     */
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
