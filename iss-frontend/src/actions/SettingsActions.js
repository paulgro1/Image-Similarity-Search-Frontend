export const SHOW_SETTINGS_DIALOG = 'SHOW_SETTINGS_DIALOG';
export const HIDE_SETTINGS_DIALOG = 'HIDE_SETTINGS_DIALOG';
export const SET_SLIDER_VALUE = 'SET_SLIDER_VALUE';

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
 * This function dispatches the setSliderValueAction.
 * @param {number} value - slider value
 * @returns {function} dispatch - a function that dispatches the action
*/

export function setSliderValue(value) {
    return dispatch => {
        console.log("Setting SliderValue: " + value)
        dispatch(setSliderValueAction(value));
    }
}
