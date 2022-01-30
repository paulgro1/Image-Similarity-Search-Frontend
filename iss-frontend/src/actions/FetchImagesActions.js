import * as route from '../config/Routes';
import axios from 'axios';
var request = require('request');
var JSZip = require("jszip");
    
export const SHOW_INFORMATION_DIALOG = "SHOW_INFORMATION_DIALOG";
export const HIDE_INFORMATION_DIALOG = "HIDE_INFORMATION_DIALOG";

/**
 * This function returns an action object.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function showInformationDialogAction() {
    return {
        type: SHOW_INFORMATION_DIALOG,
    }
}

/**
 * This function returns an action object.
 * @returns {object} - action object that will be send to the RootReducer
 */
export function hideInformationDialogAction() {
    return {
        type: HIDE_INFORMATION_DIALOG,
    }
}

/**
 * This function fetches the metadata for all thumbnail images.
 * @returns {object} - object with the response (thumbnail meta data or error)
 */
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

/**
 * This function fetches one image.
 * @param {number} id - image id
 * @param {string} sessionToken - token for current session
 * @returns {string} - one fullsize image blob url, which was received from the backend 
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

/**
 * Callback for returning the image URLs.
 * @callback returnURLsCallback
 * @param {string[]} imageUrls - array with the image URLs
 */

/**
 * This function fetches multiple thumbnail images based on the given ids.
 * @param {string} sessionToken - token for current session
 * @param {number[]} picture_ids - array with image ids
 * @param {returnURLsCallback} callback - a callback to run
 * @returns {function} - callback wich returns the image URLs
 */
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
        var regexId = /^[^_]+(?=_)/;
        for(let zipEntry in zip.files) {
            var data = zip.file(zipEntry).async("arraybuffer").then(function (data) {
                var ext = regex.exec(zipEntry)[0];
                var thumbnailId = regexId.exec(zipEntry)[0];
                var type = "image/" + ext.split('.')[1];
                var buffer = new Uint8Array(data);
                var blob = new Blob([buffer.buffer], {type: type});
                let url = URL.createObjectURL(blob)
                var thumbnailData = {url: url, thumbnailId: thumbnailId}
                return thumbnailData
               });
               imageUrls.push(data)
        }
        return callback(imageUrls)
        })
    });
}

/**
 * This function fetches all thumbnail images.
 * @param {string} sessionToken - token for current session
 * @param {returnURLsCallback} callback - a callback to run
 * @returns {function} - callback wich returns the image URLs
 */
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

/**
 * This function fetches k nearest neighbours for one image.
 * @param {number} id - image id
 * @param {number} k - integer number of nearest neighbours to fetch
 * @param {string} sessionToken - token for current session
 * @returns {object} - object with nearest neighbours
 */
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
                k: k
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

/**
 * This function fetches k nearest neighbours for all images.
 * @param {number} k - integer number of nearest neighbours to fetch
 * @returns {object} - object with nearest neighbours
 */
export function fetchAllNearestNeighbours(k) {
    console.log("Fetch " + k +" NN of all images")
    return axios({
            method: 'GET',
            url: route.FETCH_ALL_NEAREST_NEIGHBOURS + k, 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            return response.data;
        })
}

/**
 * This function fetches k nearest neighbours for multiple images based on the given ids.
 * Relevant for Excel export.
 * @param {number} k - integer number of nearest neighbours to fetch
 * @param {number[]} ids - ids of images
 * @returns {object} - object with nearest neighbours
 */
export function fetchNearestNeighboursWithIds(k, ids) {
    console.log("Fetch " + k +" NN of " + ids.length + " images.")
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

/**
 * This function fetches all image ids.
 * @returns {object} - object with all image ids
 */
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

