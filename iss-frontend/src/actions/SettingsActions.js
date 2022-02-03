import * as route from '../config/Routes';
export const SHOW_SETTINGS_DIALOG = 'SHOW_SETTINGS_DIALOG';
export const HIDE_SETTINGS_DIALOG = 'HIDE_SETTINGS_DIALOG';
export const SET_SLIDER_VALUE = 'SET_SLIDER_VALUE';
export const SET_CLUSTER_VALUE = 'SET_CLUSTERCENTER_VALUE'
export const SET_CLUSTERSWITCH = 'SET_CLUSTERSWITCH'
export const SET_MARK_ACTIVE = 'SET_MARK_ACTIVE'

export function getShowSettingsDialogAction() {
    return {
        type: SHOW_SETTINGS_DIALOG
    }
}

export function getHideSettingsDialogAction() {
    return {
        type: HIDE_SETTINGS_DIALOG
    }
}

export function setSliderValueAction(value) {
    return {
        type: SET_SLIDER_VALUE,
        value: value
    }
}

export function setClusterCenterValueAction(value) {
    return {
        type: SET_CLUSTER_VALUE,
        value: value
    }
}

export function setClusterSwitchAction(value) {
    return {
        type: SET_CLUSTERSWITCH,
        value: value
    }
}

export function setMarkActiveAction(markActive, markedImagesIDs) {
    return {
        type: SET_MARK_ACTIVE,
        markActive: markActive,
        markedImagesIDs: markedImagesIDs
    }
}


/**
 * @param value - slider value
 * This function dispatches the setSliderValueAction.
 */
export function setNeighboursSliderValue(value) {
    return dispatch => {
        console.log("Settings: NeighboursSliderValue: " + value)
        dispatch(setSliderValueAction(value));
    }
}

export const setClusterCenterValue = (value, sessionToken) => {
    return function (dispatch) {
        console.log("Settings: ClusterSliderValue: " + value)
        fetchSetClusterValue(value, sessionToken).then(function () {
            dispatch(setClusterCenterValueAction(value))
        })
    }
}

export const fetchSetClusterValue = (value, sessionToken) => {
    return fetch(route.CHANGE_CLUSTER_VALUE, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Api-Session-Token': sessionToken
        },
        body: JSON.stringify({
            nr_of_centroids: value
        })
    })
}

export const setClusterSwitch = (value) => {
    return (dispatch) => {
        dispatch(setClusterSwitchAction(value))
    }
}

export const setMarkActive = (markActive, markedImagesIDs) => {
    console.log(markedImagesIDs)
    return (dispatch) => {
        dispatch(setMarkActiveAction(markActive, markedImagesIDs))
    }
}