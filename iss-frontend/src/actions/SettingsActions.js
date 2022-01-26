export const SHOW_SETTINGS_DIALOG = 'SHOW_SETTINGS_DIALOG';
export const HIDE_SETTINGS_DIALOG = 'HIDE_SETTINGS_DIALOG';
export const SET_SLIDER_VALUE = 'SET_SLIDER_VALUE';

export function getShowSettingsDialogAction(){
    return {
        type: SHOW_SETTINGS_DIALOG
    }
}

export function getHideSettingsDialogAction(){
    return {
        type: HIDE_SETTINGS_DIALOG
    }
}

export function setSliderValueAction(value){
    return {
        type: SET_SLIDER_VALUE,
        value: value
    }
}


/**
 * @param value - slider value
 * This function dispatches the setSliderValueAction.
*/
export function setSliderValue(value) {
    return dispatch => {
        console.log("Setting SliderValue: " + value)
        dispatch(setSliderValueAction(value));
    }
}
