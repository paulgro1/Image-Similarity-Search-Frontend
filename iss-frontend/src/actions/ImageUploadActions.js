import axios from 'axios';
import * as route from '../config/Routes';

export const SHOW_IMAGE_UPLOAD_DIALOG = 'SHOW_IMAGE_UPLOAD_DIALOG';
export const HIDE_IMAGE_UPLOAD_DIALOG = 'HIDE_IMAGE_UPLOAD_DIALOG';
export const UPLOAD_PENDING = 'UPLOAD PENDING';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const SEND_FILES_TO_STORE = 'SEND_FILES_TO_STORE';

export function getShowImageUploadDialogAction(){
    return {
        type: SHOW_IMAGE_UPLOAD_DIALOG
    }
}

export function getHideImageUploadDialogAction(){
    return {
        type: HIDE_IMAGE_UPLOAD_DIALOG
    }
}

// provides uploaded files from UploadButton in D3 Map
export function getSendFilesToStoreAction(files){
    return {
        type: SEND_FILES_TO_STORE,
        files: files
    }
}

export function getUploadPendingAction(){
    return {
        type: UPLOAD_PENDING
    }
}

export function getUploadSuccessAction(response){
    return {
        type: UPLOAD_SUCCESS,
        uploadedImages: response
    }
}

export function getUploadErrorAction(error){
    return {
        type: UPLOAD_ERROR,
        error: error
    }
}

/**
 * @param token - user session token
 * @param formData - uploaded image wrapped in a form
 * 
 * This function calls the upload() function and 
 * dispatches the actions.
*/
export function imageUpload(formData, sessionToken) {
    return dispatch => {
        dispatch(getUploadPendingAction());
        upload(formData, sessionToken)
            .then(function(response){
                console.log("imageUpload response: " + JSON.stringify(response.imageData));
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
 * @param formData - uploaded image wrapped in a form
 * 
 * This function sends the image included in the formData to the
 * backend. 
 * @returns response recieved from the backend
*/
async function upload(formData, sessionToken) {
    console.log(sessionToken)
    // log all entries of formData Object
    for(let pair of formData.entries()){
        console.log(pair[0] + ', ' + pair[1]);
    }
    console.log(route.IMAGE_UPLOAD)
    return await axios({
        method: "POST",
        url: route.IMAGE_UPLOAD,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
            'api_session_token': sessionToken
        },
    })
    .then(response => {
        if(response.status === 200) {
            let responseData = response.data

            let imageData = {
                distances: responseData.distances,
                ids: responseData.ids,
                coordinates: responseData.coordinates,
                similarities: responseData.similarities
            }

            let sessionToken = response.headers.api_session_token

            return {imageData: imageData, sessionToken: sessionToken}
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