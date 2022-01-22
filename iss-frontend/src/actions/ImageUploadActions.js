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

export function getShowImageCropDialogAction(){
    return {
        type: SHOW_IMAGE_CROP_DIALOG
    }
}

export function getHideImageCropDialogAction(){
    return {
        type: HIDE_IMAGE_CROP_DIALOG
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
export function imageUpload(formData) {
    return dispatch => {
        dispatch(getUploadPendingAction());
        upload(formData)
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
 * @param formData - uploaded image wrapped in a form
 * 
 * This function sends the image included in the formData to the
 * backend. 
 * @returns response recieved from the backend
*/
async function upload(formData) {
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
        },
    })
    .then(response => {
        if(response.status === 200) {
            let responseData = response.data
            console.log(responseData)
            let imageData = {
                distances: responseData.distances,
                ids: responseData.ids,
                coordinates: responseData.coordinates,
                similarities: responseData.similarities,
                clusterCenters: responseData.cluster_centers,
                nnClusterCenters: responseData.neighbour_cluster_centers,
                nnFilenames: responseData.neighbour_filenames,
                // nach merge: ids die als response kommen verwenden für uploaded images
                uploadedFilenames: responseData.uploaded_filenames
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