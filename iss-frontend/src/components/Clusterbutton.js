
import React, { Component } from "react";
import ToggleButton from 'react-bootstrap/Button';

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
            clusterCenterValues: 10,
            clusterActive: false,
            checked: undefined,
        };
        this.showCluster = this.showCluster.bind(this)
        this.setChecked = this.setChecked.bind(this)
    }

    componentDidMount () {
        const {getImagesMetaFromDbAction} = this.props
        getImagesMetaFromDbAction()
    }

    showCluster() {
        this.props.images.forEach(image => {
            if(!this.state.clusterActive) {
                const element = document.getElementById("image_" + image.id)
                element.classList.add('cluster' + image.clusterCenter)
                this.setState({clusterActive: true})
            }
            else {
                const element = document.getElementById("image_" + image.id)
                element.classList.remove('cluster' + image.clusterCenter)
                this.setState({clusterActive: false})
            }            
        });

        
    }

    setChecked(value) {
        this.setState({checked: value})
    }
    render() {
        return (
            <div>
                <ToggleButton
                    id="toggle-check" 
                    type="checkbox" 
                    variant="secondary" 
                    checked={this.state.checked} 
                    value="1"
                    onClick={this.showCluster} 
                    onChange={(e) => this.setChecked(e.currentTarget.checked)}>
          Cluster
        </ToggleButton>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({
    getImagesMetaFromDbAction: fetchImagesActions.getImagesMetaFromDb
},dispatch)

const connectedClusterButton = connect(mapStateToProps, mapDispatchToProps)(ClusterButton);
export default connectedClusterButton;
