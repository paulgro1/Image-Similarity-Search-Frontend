
import React, { Component } from "react";

import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import '../layout/css/clusterStyle.css'

import * as fetchImagesActions from '../actions/FetchImagesActions'
import * as settingsAction from '../actions/SettingsActions'

const mapStateToProps = state => {
    return state
}

class ClusterButton extends Component  {

    constructor(props){
        super(props)
        this.state = {
            clusterCenterValue: process.env.REACT_APP_SLIDER_VALUE_CLUSTER,
            clusterActive: false,
            checked: false,
            images:[]
        };
        this.showCluster = this.showCluster.bind(this)
        this.setChecked = this.setChecked.bind(this)
    }

    componentDidMount () {
        const {getImagesMetaFromDbAction} = this.props
        getImagesMetaFromDbAction()
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.clusterCenterValue !== this.state.clusterCenterValue && nextProps.clusterCenterValue !== undefined) {
            this.setState({clusterCenterValue: nextProps.clusterCenterValue});
            this.hideCluster()
            const {getImagesMetaFromDbAction} = this.props
            getImagesMetaFromDbAction()
        }

        
    }

    showCluster() {
        const {setClusterSwitchAction} = this.props
        
            if (!this.state.clusterActive) {
                var IMAGES = this.props.images
                this.setState({
                    clusterActive: true,
                    checked: true,
                    images: IMAGES
                },  () => {
                    if(this.props.markActive) {
                        this.props.markedImagesIDs.forEach(id => {
                            const image = document.getElementById("image_" + id)
                            image.classList.add('cluster' + image.__data__.clusterCenter)
                        })
                    }
                    else {
                        IMAGES.forEach(image => {
                            const element = document.getElementById("image_" + image.id)
                            element.classList.add('cluster' + image.clusterCenter)
                        });
                    }
                    
                    console.log(this.state.clusterActive)
                    setClusterSwitchAction(this.state.clusterActive)
                })
                
            } else {
                this.hideCluster()
            }
    }

    hideCluster() {
        const {setClusterSwitchAction} = this.props
            var images = this.state.images
            if(this.state.images === undefined) {
                images = this.props.images
            }
            this.setState({
                clusterActive: false,
                checked: false
            }, () => {
                images.forEach(image => {
                    const element = document.getElementById("image_" + image.id)
                    element.classList.remove('cluster' + image.clusterCenter)
                    
                })
                console.log(this.state.clusterActive)
                setClusterSwitchAction(this.state.clusterActive)
            })
            
    }

    setChecked(value) {
        this.setState({checked: value})
    }
    render() {
        return (
            <div>
                <BootstrapSwitchButton width={130} onlabel="Cluster ON" offlabel="Cluster OFF" class="btn btn-outline-primary-xs" checked={this.state.checked} onChange={this.showCluster}/>
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
