import * as route from '../config/Routes';

export const FETCH_IMAGES_PENDING = 'FETCH_IMAGES_PENDING';
export const FETCH_IMAGES_SUCCESS = 'FETCH_IMAGES_SUCCESS';
export const FETCH_IMAGES_ERROR = 'FETCH_IMAGES_ERROR';

export const SHOW_INFORMATION_DIALOG = "SHOW_INFORMATION_DIALOG";
export const HIDE_INFORMATION_DIALOG = "HIDE_INFORMATION_DIALOG";


export function fetchImagesPendingAction(){
    return {
        type: FETCH_IMAGES_PENDING
    }
}

export function fetchImagesSuccessAction(images){
    return {
        type: FETCH_IMAGES_SUCCESS,
        images: images
    }
}

export function fetchImagesErrorAction(error){
    return {
        type: FETCH_IMAGES_ERROR,
        error: error
    }
}

export function showInformationDialogAction(){
    return {
        type: SHOW_INFORMATION_DIALOG,
    }
}

export function hideInformationDialogAction(){
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
            .then (
                function(images){
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
export function fetchOneThumbnailMeta(){
    
    var restUrl ='http://localhost:8080/images/3/metadata';
    console.log("Fetch image metadata from: " + restUrl);

    return fetch(restUrl)
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
    var image = response

        var image = {
            id: image.id,
            filename: image.filename,
            x: image.position[0],
            y: image.position[1],
        }
    return image;
}


export function fetchAllThumbnailMeta(){

    var restUrl = route.FETCH_ALL_THUMBNAIL_META;
    console.log("Fetch image metadata from: " + restUrl);

    return fetch(restUrl)
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
function handleMetaResponse(response) {
    console.log(response)
    var data = []
    data = response

    var imagesMetaArray = []
    for(const oneMeta of data){
        let image = {
            id: oneMeta.id,
            filename: oneMeta.filename,
            x: oneMeta.position[0],
            y: oneMeta.position[1],
        }
        imagesMetaArray.push(image)
    }

    return imagesMetaArray;
}

/*
 * This function fetches on image.
 * @returns one image recieved from the backend 
 */
  export function fetchOneImage(id){
    
    var restUrl = route.FETCH_ONE_IMAGE + id;
    console.log("Fetch Images from: " + restUrl);

    return fetch(restUrl)
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


export function fetchNearestNeighbours(){

    (async () => {
        const rawResponse = await fetch('http://localhost:8080/faiss/getNN/3', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({k: 6})
        });
        const content = await rawResponse.json();
      
        console.log(content);
      })();
}

function handleMetaNearestNeighboursResponse(response) {
    console.log(response)
    var data = []
    data = response

    let nearestNeighbours = {
        distances: response.distances,
        ids: response.ids,
        similarities: response.similarities,
    }

    console.log(nearestNeighbours)
    
    return nearestNeighbours;
}



