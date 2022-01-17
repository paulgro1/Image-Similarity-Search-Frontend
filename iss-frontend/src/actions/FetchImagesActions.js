import * as route from '../config/Routes';

export const FETCH_IMAGES_PENDING = 'FETCH_IMAGES_PENDING';
export const FETCH_IMAGES_SUCCESS = 'FETCH_IMAGES_SUCCESS';
export const FETCH_IMAGES_ERROR = 'FETCH_IMAGES_ERROR';

export const SHOW_INFORMATION_DIALOG = "SHOW_INFORMATION_DIALOG";
export const HIDE_INFORMATION_DIALOG = "HIDE_INFORMATION_DIALOG";


export function fetchImagesPendingAction() {
    return {
        type: FETCH_IMAGES_PENDING
    }
}

export function fetchImagesSuccessAction(images) {
    return {
        type: FETCH_IMAGES_SUCCESS,
        images: images
    }
}

export function fetchImagesErrorAction(error) {
    return {
        type: FETCH_IMAGES_ERROR,
        error: error
    }
}

export function showInformationDialogAction() {
    return {
        type: SHOW_INFORMATION_DIALOG,
    }
}

export function hideInformationDialogAction() {
    return {
        type: HIDE_INFORMATION_DIALOG,
    }
}

/**
 * This function calls the fetchImages() function and 
 * dispatches the actions.
 */
export function getImagesFromDb() {

    return dispatch => {
        dispatch(fetchImagesPendingAction());
        fetchOneThumbnailMeta()
            .then(
                function (images) {
                    const action = fetchImagesSuccessAction(images);
                    dispatch(action);
                },
                error => {
                    dispatch(fetchImagesErrorAction(error));
                }
            )
            .catch(error => {
                dispatch(fetchImagesErrorAction(error));
            })
    }
}

/**
 * This function fetches the meta-data for one thumbnail of the images for D3 map.
 * @returns array of images recieved from the backend 
 */
export function fetchOneThumbnailMeta(sessionToken) {

    var restUrl = 'http://localhost:8080/images/3/metadata';
    console.log("Fetch image metadata from: " + restUrl);

    return fetch(restUrl, { 
        method: 'GET',
        headers: {
        'api_session_token': sessionToken
        }})
        .then(response => response.json())
        .then(handleOneMetaResponse)
        .then(imageMeta => {
            return imageMeta;
        });
}

/**
 * This funtion handels the response from the backend.
 * @param response - response recieved from the backend
 * @returns object with meta-data for one image
 */
function handleOneMetaResponse(response) {
    console.log(response)
    let image = response

    image = {
        id: image.id,
        filename: image.filename,
        x: image.position[0],
        y: image.position[1],
    }
    return image;
}


export function fetchAllThumbnailMeta(sessionToken) {

    var restUrl = route.FETCH_ALL_THUMBNAIL_META;
    console.log("Fetch image metadata from: " + restUrl);

    return fetch(restUrl, { 
        method: 'GET',
        headers: {
        'api_session_token': sessionToken
        }})
        /*.then(response => {
            console.log(response)
            if(!response.headers.api_session_token === sessionToken){
                sessionToken = response.headers.api_session_token
            }   
        })*/
        .then(response => response.json())
        .then(handleMetaResponse)
        .then(imageMeta => {
            return imageMeta;
        });
}

/**
 * This funtion handels the response from the backend.
 * @param response - response recieved from the backend
 * @returns array with image metadata
 */
function handleMetaResponse(response, sessionToken) {
    console.log(response)
    let data = []
    data = response

    var imagesMetaArray = []
    for (const oneMeta of data) {
        let image = {
            id: oneMeta.id,
            filename: oneMeta.filename,
            x: oneMeta.position[0],
            y: oneMeta.position[1],
        }
        imagesMetaArray.push(image)
    }

    return imagesMetaArray
}

/*
 * This function fetches on image.
 * @returns one image recieved from the backend 
 */
export function fetchOneImage(id, sessionToken) {

    var restUrl = route.FETCH_ONE_IMAGE + id;
    console.log("Fetch Images from: " + restUrl);

    return fetch(restUrl, { 
        method: 'GET',
    headers: {
        'api_session_token': sessionToken
    }})
        .then(handleImageResponse)
        .then(image => {
            return image;
        });
}


function handleImageResponse(response) {
    console.log(response)
    return response
        .json().then(img => {

            var images = new Buffer.from(img).toString("base64")
            console.log(images)
            return images;
        });
}

export async function fetchAllThumbnails(sessionToken, callback) {
    var restUrl = route.FETCH_THUMBNAILS;
    console.log("Fetch all thumbnails from: " + restUrl);
    var request = require('request');
    var JSZip = require("jszip");
    
    request({
    method : "GET",
    headers :  {'api_session_token': sessionToken},
    url : restUrl,
    encoding: null // <- this one is important!
}, function(error, response, body) {
       /* if(!response.headers.api_session_token === sessionToken){
            sessionToken = response.headers.api_session_token
        }    */
     JSZip.loadAsync(body).then(function(zip) {
        var imageUrls = [];
        var regex = /(?:\.([^.]+))?$/;
        for(let zipEntry in zip.files) {
            var url = zip.file(zipEntry).async("arraybuffer").then(function (data) {
                var ext = regex.exec(zipEntry)[0];
                var type = "image/" + ext.split('.')[1];
                var buffer = new Uint8Array(data);
                var blob = new Blob([buffer.buffer], {type: type});
                let url = URL.createObjectURL(blob)
                return url
               });
            imageUrls.push(url)
        }
        return callback(imageUrls, sessionToken)
        })
    });
}

export function fetchNearestNeighbours(id, k, sessionToken) {
    console.log("Fetch " + k +" NN for image: " + id)
    return fetch(route.FETCH_NEAREST_NEIGHBOURS + id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_session_token': sessionToken
            },
            body: JSON.stringify({
                k: parseInt(k)
            })
        })
        .then(response => response.json())
        .then(handleMetaNearestNeighboursResponse)
        .then(nearestNeighbours => {
            return nearestNeighbours;
        });
}

function handleMetaNearestNeighboursResponse(response) {
    var nearestNeighbours = response

    nearestNeighbours = {
        distances: response.distances,
        ids: response.ids,
        similarities: response.similarities,
    }
    return nearestNeighbours;
}

function checkSessionToken(stateSessionToken, requestSessionToken){
    if(stateSessionToken === requestSessionToken){
        return true
    }
    else{
        return false
    }
}