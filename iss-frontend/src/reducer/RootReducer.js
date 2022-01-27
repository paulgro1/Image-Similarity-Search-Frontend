import * as imageUploadActions from '../actions/ImageUploadActions';
import * as fetchImagesActions from '../actions/FetchImagesActions';
import * as settingsActions from '../actions/SettingsActions';

const initialState = {
    images: [],
    uploadPending: false,
    showImageUploadDialog: false,
    showImageCropDialog: false,
    sliderValue: 5
};

/**
 * @param state - default: the initial state of the application
 * @param action - an action given to the store
 * 
 * Everytime the rootReducer is called, redux passes the current state
 * and the action that was send to the store to the rootReducer.
 */

function rootReducer(state=initialState, action) {
    console.log("Action in Reducer: " + action.type);

    switch(action.type){
        case imageUploadActions.SHOW_IMAGE_UPLOAD_DIALOG:
            return {
                ...state,
                showImageUploadDialog: true,
                uploadedImages: action.uploadedImages,
                error: null
            }
        case imageUploadActions.HIDE_IMAGE_UPLOAD_DIALOG:
          
            return {
                ...state,
                showImageUploadDialog: false,
                uploadedImages: action.uploadedImages,
                error: null
            }

        case imageUploadActions.SHOW_IMAGE_CROP_DIALOG:
            return {
                ...state,
                showImageCropDialog: true,
                uploadedImages: action.uploadedImages,
                error: null
            }    

        case imageUploadActions.HIDE_IMAGE_CROP_DIALOG:
            return {
                ...state,
                showImageCropDialog: false,
                uploadedImages: action.uploadedImages,
                error: null
            }    


        case imageUploadActions.UPLOAD_PENDING:
            return {
                ...state,
                pending: true,
                error: null
            }
        case imageUploadActions.UPLOAD_SUCCESS:
            return {
                ...state,
                showImageUploadDialog: false,
                showImageCropDialog: false,
                pending: false,
                uploadedImages: action.uploadedImages,
                error: null
            }
        case imageUploadActions.UPLOAD_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case imageUploadActions.SEND_FILES_TO_STORE:
            if(action.source === "multi"){
                return {
                    showImageUploadDialog: true,
                    files: action.files,
                    pending: false,
                    error: null
                }
            }else{
                return {
                    files: action.files
                }
            }
            
        case fetchImagesActions.FETCH_IMAGES_PENDING:
            return {
                ...state,
                pending: true,
                error: null
            }
        case fetchImagesActions.FETCH_IMAGES_SUCCESS:
            return {
                ...state,
                images: action.images,
                pending: false,
                error: null
            }
        case fetchImagesActions.FETCH_IMAGES_ERROR:
            return {
                ...state,
                images: undefined,
                pending: false,
                error: action.error
            }
        case fetchImagesActions.SHOW_INFORMATION_DIALOG:
            return {
                ...state,
                showInformationDialog: true,
                pending: false,
                error: null
            }
        case fetchImagesActions.HIDE_INFORMATION_DIALOG:
            return {
                ...state,
                showInformationDialog: false,
                pending: false,
                error: null
            }
        case settingsActions.SHOW_SETTINGS_DIALOG:
            return {
                ...state,
                showSettingsDialog: true
            }
        case settingsActions.HIDE_SETTINGS_DIALOG:
            return {
                ...state,
                showSettingsDialog: false
            }
        case settingsActions.SET_SLIDER_VALUE:
            return {
                ...state,
                sliderValue: action.value
            }
        case settingsActions.SET_CLUSTER_VALUE:
            console.log('SET_CLUSTER_VALUE')
            console.log(action)
            return {
                ...state,
                clusterCenterValue: action.value
            }
        case authenticationActions.SET_SESSION_TOKEN:
            return{
                ...state,
                sessionToken: action.sessionToken
            }
        default:
            return state
    }
};

export default rootReducer;