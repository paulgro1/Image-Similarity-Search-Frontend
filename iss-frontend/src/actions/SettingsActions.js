import * as route from '../config/Routes';
export const SHOW_SETTINGS_DIALOG = 'SHOW_SETTINGS_DIALOG';
export const HIDE_SETTINGS_DIALOG = 'HIDE_SETTINGS_DIALOG';
export const SET_SLIDER_VALUE = 'SET_SLIDER_VALUE';
export const SET_CLUSTER_VALUE = 'SET_CLUSTERCENTER_VALUE'
export const SET_CLUSTERSWITCH = 'SET_CLUSTERSWITCH'
export const SET_MARK_ACTIVE = 'SET_MARK_ACTIVE'

/**
 * This function returns an action object to show the settings dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getShowSettingsDialogAction(){
    return {
        type: SHOW_SETTINGS_DIALOG
    }
}

/**
 * This function returns an action object to hide the settings dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getHideSettingsDialogAction(){
    return {
        type: HIDE_SETTINGS_DIALOG
    }
}

/**
 * This function returns an action object to set the slider value.
 * @param {number} value - slider value (number of nearest neighbours)
 * @returns {object} - action object that will be send to the RootReducer
 */
export function setSliderValueAction(value){
    return {
        type: SET_SLIDER_VALUE,
        value: value
    }
}

/**
 * This function returns an action object to set the slider value.
 * @param {number} value - slider value (number of clusters)
 * @returns {object} - action object that will be send to the RootReducer
 */
export function setClusterCenterValueAction(value) {
    return {
        type: SET_CLUSTER_VALUE,
        value: value
    }
}

/**
 * This function returns an action object to set the slider value.
 * @param {number} value - switch value (on or off)
 * @returns {object} - action object that will be send to the RootReducer
 */
export function setClusterSwitchAction(value) {
    return {
        type: SET_CLUSTERSWITCH,
        value: value
    }
}

/**
 * This function returns an action object to set the slider value.
 * @param {boolean} markActive - marked true or false
 * @param {object} markedImagesIDs - IDs of marked images
 * @returns {object} - action object that will be send to the RootReducer
 */
export function setMarkActiveAction(markActive, markedImagesIDs) {
    return {
        type: SET_MARK_ACTIVE,
        markActive: markActive,
        markedImagesIDs: markedImagesIDs
    }
}

/**
 * This function dispatches the setSliderValueAction.
 * @param {number} value - slider value
 * @returns {function} dispatch - a function that dispatches the action
*/
export function setNeighboursSliderValue(value) {
    return dispatch => {
        console.log("Settings: NeighboursSliderValue: " + value)
        dispatch(setSliderValueAction(value));
    }
}

/**
 * This function dispatches the setSliderValueAction.
 * @param {number} value - slider value
 * @param {string} sessionToken - token of current user session
 * @returns {function} dispatch - a function that dispatches the action
*/
export const setClusterCenterValue = (value, sessionToken) => {
    return function (dispatch) {
        console.log("Settings: ClusterSliderValue: " + value)
        fetchSetClusterValue(value, sessionToken).then(function () {
            dispatch(setClusterCenterValueAction(value))
        })
    }
}

/**
 * This function dispatches the setSliderValueAction.
 * @param {number} value - slider value
 * @param {string} sessionToken - token of current user session
 * @returns {object} backend response
*/
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

/**
 * This function dispatches the setClusterSwitchAction.
 * @param {number} value - slider value
 * @returns {function} dispatch - a function that dispatches the action
*/
export const setClusterSwitch = (value) => {
    return (dispatch) => {
        dispatch(setClusterSwitchAction(value))
    }
}

/**
 * This function dispatches the setMarkActiveAction.
 * @param {boolean} markActive - marked true or false
 * @param {object} markedImagesIDs - IDs of marked images
 * @returns {object} dispatch - a function that dispatches the action
 */
export const setMarkActive = (markActive, markedImagesIDs) => {
    return (dispatch) => {
        dispatch(setMarkActiveAction(markActive, markedImagesIDs))
    }
}