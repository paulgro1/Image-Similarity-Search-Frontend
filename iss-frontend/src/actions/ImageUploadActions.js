import axios from 'axios';
import * as route from '../config/Routes';

export const SHOW_IMAGE_UPLOAD_DIALOG = 'SHOW_IMAGE_UPLOAD_DIALOG';
export const HIDE_IMAGE_UPLOAD_DIALOG = 'HIDE_IMAGE_UPLOAD_DIALOG';
export const SHOW_IMAGE_CROP_DIALOG = 'SHOW_IMAGE_CROP_DIALOG';
export const HIDE_IMAGE_CROP_DIALOG = 'HIDE_IMAGE_CROP_DIALOG';
export const UPLOAD_PENDING = 'UPLOAD PENDING';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const SEND_FILES_TO_STORE = 'SEND_FILES_TO_STORE';

/**
 * This function returns an action object to show the image upload dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getShowImageUploadDialogAction(){
    return {
        type: SHOW_IMAGE_UPLOAD_DIALOG
    }
}

/**
 * This function returns an action object to hide the image upload dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getHideImageUploadDialogAction(){
    return {
        type: HIDE_IMAGE_UPLOAD_DIALOG
    }
}

/**
 * This function returns an action object to show the image crop dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getShowImageCropDialogAction(){
    return {
        type: SHOW_IMAGE_CROP_DIALOG
    }
}

/**
 * This function returns an action object to hide the image crop dialog.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getHideImageCropDialogAction(){
    return {
        type: HIDE_IMAGE_CROP_DIALOG
    }
}

/**
 * This function returns an action object wich provides uploaded files from UploadButton in D3 Map.
 * @param {object} files - uploaded files
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getSendFilesToStoreAction(files, source="multi"){
    return {
        type: SEND_FILES_TO_STORE,
        files: files,
        source: source
    }
}

/**
 * This function returns a pending action object.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getUploadPendingAction(){
    return {
        type: UPLOAD_PENDING
    }
}

/**
 * This function returns an action object wich provides the uploaded images.
 * @param {object} response - uploaded images
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getUploadSuccessAction(response){
    return {
        type: UPLOAD_SUCCESS,
        uploadedImages: response
    }
}

/**
 * This function returns an error action object.
 * @param {object} error - error message
 * @returns {object} - action object that will be send to the RootReducer
 */
export function getUploadErrorAction(error){
    return {
        type: UPLOAD_ERROR,
        error: error
    }
}

/**
 * This function handles the image upload and dispatches the actions.
 * @param {object} formData - uploaded image wrapped in a form
 * @returns {function} dispatch - a function that dispatches the action
*/
export function imageUpload(formData) {
    return dispatch => {
        dispatch(getUploadPendingAction());
        upload(formData)
            .then(function(response){
                const action = getUploadSuccessAction(response);
                dispatch(action);
            },
            error =>{
                dispatch(getUploadErrorAction(error));
            })
            .catch(error =>{
                dispatch(getUploadErrorAction(error));
            })
    }
}

/**
 * This function sends images wrapped in a formData object to the backend. 
 * @param {object} formData - uploaded images wrapped in a form
 * @returns {object} - object with the response (image data or error)
*/
async function upload(formData) {
    console.log("Uploading images to: " + route.IMAGE_UPLOAD)
    return await axios({
        method: "POST",
        url: route.IMAGE_UPLOAD,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then(response => {
        if(response.status === 200) {
            let responseData = response.data
            let imageData = {
                distances: responseData.distances,
                ids: responseData.new_ids,
                filenames: responseData.uploaded_filenames,
                coordinates: responseData.coordinates,
                similarities: responseData.similarities,
                clusterCenters: responseData.cluster_centers,
                nnClusterCenters: responseData.neighbour_cluster_centers,
                nnFilenames: responseData.neighbour_filenames,
                nnIds: responseData.ids,
                uploaded: true,
            }


            return imageData
        }
        else {
            console.log("Error occured in image upload response.")
        }   
    }).catch(error => {
        console.log("Error occured in image upload.")
        console.log(error)
        return(error)
    })
}