
import React, { Component } from "react";

import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import * as d3 from 'd3';

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
        console.log(this.props)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.clusterCenterValue !== this.state.clusterCenterValue && nextProps.clusterCenterValue !== undefined) {
            this.setState({clusterCenterValue: nextProps.clusterCenterValue});
            const {getImagesMetaFromDbAction} = this.props
            getImagesMetaFromDbAction()
        }
    }

    showCluster() {
        if (!this.state.clusterActive) {
            var IMAGES = this.props.images
            this.setState({
                clusterActive: true,
                checked: true,
                images: IMAGES
            }, function () {
                IMAGES.forEach(image => {
                    const element = document.getElementById("image_" + image.id)
                    element.classList.add('cluster' + image.clusterCenter)
                    
                });
            })
            
        } else {
            this.hideCluster()
        }
    }

    hideCluster() {
        this.setState({
            clusterActive: false,
            checked: false
        }, function() {
            this.state.images.forEach(image => {
                const element = document.getElementById("image_" + image.id)
                element.classList.remove('cluster' + image.clusterCenter)
                
            })
        })
    }

    setChecked(value) {
        console.log(value)
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
},dispatch)

const connectedClusterButton = connect(mapStateToProps, mapDispatchToProps)(ClusterButton);
export default connectedClusterButton;
