
import React, { Component } from "react";

import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import '../layout/css/clusterStyle.css'
import '../layout/css/HeaderStyle.css'
import warning from '../InstructionIcons/warning.svg';

import * as fetchImagesActions from '../actions/FetchImagesActions'
import * as settingsAction from '../actions/SettingsActions'

const mapStateToProps = state => {
    return state
}

/**
 * Class representing the cluster button component.
 * @prop {object} images - uploaded images
 * @prop {boolean} markActive - marked true or false
 * @prop {object} markedImagesIDs - IDs of marked images
 * @prop {function} getImagesMetaFromDbAction - fetches the meta data of all images
 * @prop {function} setClusterSwitchAction - sets the cluster switch value
 *
 * @extends {Component}
 */
class ClusterButton extends Component  {

    /**
     * Create a ClusterButton component.
     * @param {object} props - properties from redux store
     */
    constructor(props){
        super(props)
        this.state = {
            clusterCenterValue: process.env.REACT_APP_SLIDER_VALUE_CLUSTER,
            clusterActive: false,
            checked: false,
            images:[],
            oldMarkedImages: undefined
        };
        this.showCluster = this.showCluster.bind(this)
        this.setChecked = this.setChecked.bind(this)
    }

    /**
     * This function is called when the component first mounts.
     */
    componentDidMount () {
        const {getImagesMetaFromDbAction} = this.props
        const images = getImagesMetaFromDbAction()
        this.setState({images: images})
    }

    /**
     * This function updates the props.
     * @param {object} nextProps - properties from redux store
     */
    async componentWillReceiveProps(nextProps) {
        if (nextProps.clusterCenterValue !== this.state.clusterCenterValue && nextProps.clusterCenterValue !== undefined) {
            this.setState({clusterCenterValue: nextProps.clusterCenterValue});
            this.hideCluster()
            const {getImagesMetaFromDbAction} = this.props
            await getImagesMetaFromDbAction()
            
        }        
    }

    /**
     * This function shows the clusters of the images.
     */
    showCluster() {
        const {setClusterSwitchAction} = this.props
        const oldMarkedImages = []
            if (!this.state.clusterActive) {
                var IMAGES = this.props.images
                this.setState({
                    clusterActive: true,
                    checked: true,
                    oldImages: IMAGES,
                    images: IMAGES
                },  () => {
                    if(this.props.markActive) {
                        this.props.markedImagesIDs.forEach(id => {
                            const image = document.getElementById("image_" + id)
                            image.classList.add('cluster' + image.__data__.clusterCenter)
                            oldMarkedImages.push(image)
                        })
                        this.setState({
                            oldMarkedImages: oldMarkedImages
                        })
                    }
                    else {
                        IMAGES.forEach(image => {
                            const element = document.getElementById("image_" + image.id)
                            element.classList.add('cluster' + image.clusterCenter)
                        });
                    }
                    setClusterSwitchAction(this.state.clusterActive)
                })
                
            } else {
                this.hideCluster()
            }
    }

    /**
     * This function hides the clusters.
     */
    hideCluster() {
        const {setClusterSwitchAction} = this.props
        if(this.state.images !== undefined) {
            var images = this.state.images
            this.setState({
                clusterActive: false,
                checked: false
            }, () => {
                if(this.state.oldMarkedImages !== undefined){
                    this.state.oldMarkedImages.forEach(image => {
                        image.classList.remove('cluster' + image.__data__.clusterCenter)
                    })
                }
                images.forEach(image => {
                    const element = document.getElementById("image_" + image.id)
                    element.classList.remove('cluster' + image.clusterCenter)
                    
                })
                setClusterSwitchAction(this.state.clusterActive)
            })
        }
        else{ 
            return} 
            
    }

    /**
     * This function sets images "checked" true or false.
     * @param {boolean} value 
     */
    setChecked(value) {
        this.setState({checked: value})
    }

    /**
     * This function renders the cluster button.
     * If images are marked it returns a warning so that the user 
     * umarks the images before switching clusters on or off.
     * @returns {object} - React component
     */
    render() {

        if(this.props.markActive) {
            return(
                
                <div className="col" id="alert">
                    <img id="attentionIcon" src={warning} height={20}  alt="scroll icon" />
                    Please unmark before using Clusterswitch!
                </div>
            )
        }
        return (
            <div id="navButton">
                <BootstrapSwitchButton width={130} onlabel="Cluster ON" offlabel="Cluster OFF" className="btn btn-outline-primary-xs" checked={this.state.checked} onChange={this.showCluster}/>
            </div>
            
        )
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    getImagesMetaFromDbAction: fetchImagesActions.getImagesMetaFromDb,
    setClusterCenterValueAction: settingsAction.setClusterCenterValue,
    setClusterSwitchAction: settingsAction.setClusterSwitch,
},dispatch)

const connectedClusterButton = connect(mapStateToProps, mapDispatchToProps)(ClusterButton);
export default connectedClusterButton;
