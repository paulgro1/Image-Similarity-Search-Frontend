import * as route from '../config/Routes';
import axios from 'axios';
var request = require('request');
var JSZip = require("jszip");
    
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


export const getImagesMetaFromDb = () => {

    return function (dispatch) {
        dispatch(fetchImagesPendingAction());
        fetchAllThumbnailMeta()
            .then(
                function (imagesMeta) {
                    const action = fetchImagesSuccessAction(imagesMeta);
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



export function fetchAllThumbnailMeta() {
    console.log("Fetch image metadata from: " + route.FETCH_ALL_THUMBNAIL_META);

    return axios({
        method: "GET",
        url: route.FETCH_ALL_THUMBNAIL_META,
    })
    .then(response => {
        if(response.status === 200) {
            let data = []
            data = response.data

        var imagesMetaArray = []
        for (const oneMeta of data) {
            let image = {
                id: oneMeta.id,
                filename: oneMeta.filename,
                x: oneMeta.position[0],
                y: oneMeta.position[1],
                thumbnailSize: oneMeta.thumbnail_size,
                clusterCenter: oneMeta.cluster_center

            }
        imagesMetaArray.push(image)
        }

        return imagesMetaArray
    }
    else {
        console.log("Error occured in thumbnail metadata response.")
    }   
    }).catch(error => {
        console.log("Error occured in metadata response.")
        console.log(error)
        return(error)
    })
}

/*
 * This function fetches on image.
 * @returns one fullsize image blob url, which was received from the backend 
 */
export function fetchOneImage(id, sessionToken) {
    var restUrl = route.FETCH_ONE_IMAGE + id;
    console.log("Fetch One Image from: " + restUrl);

    return fetch(restUrl, { 
        method: 'GET',
    headers: {
        'Api-Session-Token': sessionToken
    }})
        .then(response => response.blob())
        .then(blob => {
            return URL.createObjectURL(blob)
        })
}

export async function fetchMultipleThumbnails(sessionToken, picture_ids, callback) {
    var restUrl = route.FETCH_MULTIPLE_THUMBNAILS;
    console.log("Fetch multiple thumbnails with the ids: " + picture_ids + " from: " + restUrl);
    
    request({
    method : "POST",
    headers :  {'Api-Session-Token': sessionToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
    },
    url : restUrl,
    encoding: null, // <- this one is important!
    body: JSON.stringify({
        picture_ids: picture_ids
    })
}, function(error, response, body) {
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
        return callback(imageUrls)
        })
    });
}

export async function fetchAllThumbnails(sessionToken, callback) {
    var restUrl = route.FETCH_THUMBNAILS;
    console.log("Fetch all thumbnails from: " + restUrl);

    request({
    method : "GET",
    headers :  {'Api-Session-Token': sessionToken},
    url : restUrl,
    encoding: null // <- this one is important!
}, function(error, response, body) {
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
        return callback(imageUrls)
        })
    });
}

export function fetchNearestNeighbours(id, k, sessionToken) {
    console.log("Fetch " + k +" NN for image: " + id)
    
    return axios({
            method: 'POST',
            url: route.FETCH_NEAREST_NEIGHBOURS + id,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Api-Session-Token': sessionToken
            }, 
            data: JSON.stringify({
                k: parseInt(k)
            })
        })
        .then(response => {
            response = response.data
            var nearestNeighbours = {
                distances: response.distances,
                ids: response.ids,
                clusterCenters: response.neighbour_cluster_centers,
                similarities: response.similarities,
                filenames: response.neighbour_filenames
            }
            return nearestNeighbours;
        })
}

export function fetchAllNearestNeighbours(k) {
    console.log("Fetch " + k +" NN of all images")
    return axios({
            method: 'GET',
            url: route.FETCH_ALL_NEAREST_NEIGHBOURS + k, 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data;
        })
}

export function fetchNearestNeighboursWithIds(k, ids) {
    console.log("Fetch " + k +" NN of all images")
    return axios({
            method: 'POST',
            url: route.FETCH_ALL_NEAREST_NEIGHBOURS + k,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                picture_ids: ids
            })
        })
        .then(response => {
            return response.data;
        })
}

export function fetchAllImagesIds(){
    console.log('Fetch Ids of all images.')
    return axios({
        method: 'GET',
        url: route.FETCH_ALL_IMAGES_IDS, 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.data;
    })
}

