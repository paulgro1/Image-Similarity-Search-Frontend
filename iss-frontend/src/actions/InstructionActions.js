export const SHOW_INSTRUCTIONS_DIALOG = 'SHOW_INSTRUCTIONS_DIALOG';
export const HIDE_INSTRUCTIONS_DIALOG = 'HIDE_INSTRUCTIONS_DIALOG'




/**
 * This function returns an action object to show the instructions dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
 export function getShowInstructionsDialogAction(){
    return {
        type: SHOW_INSTRUCTIONS_DIALOG
    }
}

/**
 * This function returns an action object to hide the instructions dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getHideInstructionsDialogAction(){
    return {
        type: HIDE_INSTRUCTIONS_DIALOG
    }
}