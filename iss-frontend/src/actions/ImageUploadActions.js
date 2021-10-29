import axios from 'axios';
import * as route from '../config/Routes';

export const SHOW_IMAGE_UPLOAD_DIALOG = 'SHOW_IMAGE_UPLOAD_DIALOG';
export const HIDE_IMAGE_UPLOAD_DIALOG = 'HIDE_IMAGE_UPLOAD_DIALOG';
export const UPLOAD_PENDING = 'UPLOAD PENDING';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';

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

export function getUploadPendingAction(){
    return {
        type: UPLOAD_PENDING
    }
}

export function getUploadSuccessAction(response){
    return {
        type: UPLOAD_SUCCESS,
        response: response
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
export function imageUpload(token, formData) {
    return dispatch => {
        dispatch(getUploadPendingAction());
        upload(token, formData)
            .then(function(response){
                console.log("imageUpload response: " + JSON.stringify(response));
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
 * @param token - user session token
 * @param formData - uploaded image wrapped in a form
 * 
 * This function sends the image included in the formData to the
 * backend. 
 * @returns response recieved from the backend
*/
async function upload(token, formData) {

    return await axios({
        method: "post",
        url: route.IMAGE_UPLOAD,
        data: formData,
        headers: {
            "token": token,
            "Content-Type": "multipart/form-data"
        }
    })
    .then(response => {
        if(response.status === 200) {
            console.log("Response from image upload: " + JSON.stringify(response.data))
            /* TODO
            *  Je nachdem was der Server returned, können wir hier die Daten aufbereiten,
            *  eh sie an die components übergeben werden.
            */
            return response;
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