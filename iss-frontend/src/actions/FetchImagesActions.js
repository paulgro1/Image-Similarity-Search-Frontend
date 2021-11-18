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
        fetchImages()
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
 * This function fetches the images.
 * @returns array of images recieved from the backend 
 */
export function fetchImages(){
    
    var restUrl = route.FETCH_IMAGES;
    console.log("Fetch Images from: " + restUrl);

    return fetch(restUrl)
        .then(handleResponse)
        .then(images => {
            return images;
    });
}

/**
 * This funtion handels the response from the backend.
 * @param response - response recieved from the backend
 * @returns array with images
 */
function handleResponse(response) {
    return response.text().then(text => {
        var images = JSON.parse(text)

        var imagesArray = []
        for(let i = 0; i < images.length; i++){
            // TODO: richtige Parameter abrufen, diese hier sind nur Platzhalter.
            let image = {
                _id: images[i]._id,
                x: images[i].x,
                y: images[i].y,
                url: images[i].url
            }
            imagesArray.push(image)
        }
        
        return imagesArray;
    });
}