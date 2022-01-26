
import React, { Component } from "react";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import '../layout/css/clusterStyle.css'

import * as fetchImagesActions from '../actions/FetchImagesActions'

const mapStateToProps = state => {
    return state
}

class ClusterButton extends Component  {

    constructor(props){
        super(props)
        this.state = {
            clusterCenterValue: 5,
            clusterActive: false,
            checked: false,
        };
        this.showCluster = this.showCluster.bind(this)
        this.setChecked = this.setChecked.bind(this)
    }

    componentDidMount () {
        const {getImagesMetaFromDbAction} = this.props
        getImagesMetaFromDbAction()
    }

    componentDidUpdate(nextProps) {
        console.log(nextProps)
        if (nextProps.clusterCenterValue !== this.state.clusterCenterValue && nextProps.clusterCenterValue !== undefined) {
            this.setState({clusterCenterValue: nextProps.clusterCenterValue});
            const {getImagesMetaFromDbAction} = this.props
            getImagesMetaFromDbAction()
        }
    }

    showCluster() {
        this.props.images.forEach(image => {
            if(!this.state.clusterActive) {
                const element = document.getElementById("image_" + image.id)
                element.classList.add('cluster' + image.clusterCenter)
                this.setState({
                    clusterActive: true,
                    checked: true
                })
            }
            else {
                const element = document.getElementById("image_" + image.id)
                element.classList.remove('cluster' + image.clusterCenter)
                this.setState({
                    clusterActive: false,
                    checked: false
                })
            }            
        });

        
    }

    setChecked(value) {
        console.log(value)
        this.setState({checked: value})
    }
    render() {
        return (
            <div>
                <BootstrapSwitchButton width={130} style="border" onlabel="Cluster ON" offlabel="Cluster OFF" class="btn btn-outline-primary-xs" checked={this.state.checked} onChange={this.showCluster}/>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    getImagesMetaFromDbAction: fetchImagesActions.getImagesMetaFromDb
},dispatch)

const connectedClusterButton = connect(mapStateToProps, mapDispatchToProps)(ClusterButton);
export default connectedClusterButton;
