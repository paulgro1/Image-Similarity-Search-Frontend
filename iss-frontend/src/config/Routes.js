// TODO: korrekte Routen einfügen
export const IMAGE_UPLOAD = process.env.REACT_APP_BACKEND_SERVER + 'upload';
export const FETCH_THUMBNAILS = process.env.REACT_APP_BACKEND_SERVER  + 'images/thumbnails/all';
export const FETCH_MULTIPLE_THUMBNAILS = process.env.REACT_APP_BACKEND_SERVER  + 'images/thumbnails/multiple';
export const FETCH_ALL_THUMBNAIL_META = process.env.REACT_APP_BACKEND_SERVER  + 'images/all/metadata';
export const FETCH_ONE_THUMBNAIL_META = process.env.REACT_APP_BACKEND_SERVER  + 'images/';
export const FETCH_ONE_IMAGE = process.env.REACT_APP_BACKEND_SERVER  + 'images/';
export const FETCH_NEAREST_NEIGHBOURS = process.env.REACT_APP_BACKEND_SERVER  + 'faiss/getNN/';
export const AUTHENTICATE = process.env.REACT_APP_BACKEND_SERVER  + 'authenticate/';
export const FETCH_ALL_NEAREST_NEIGHBOURS = process.env.REACT_APP_BACKEND_SERVER + 'faiss/getNN/multiple/';
export const FETCH_ALL_IMAGES_IDS = process.env.REACT_APP_BACKEND_SERVER + '/images/ids'
export const CHANGE_CLUSTER_VALUE = process.env.REACT_APP_BACKEND_SERVER + '/kmeans/centroids'
export const FETCH_IMAGE_SIZE = process.env.REACT_APP_BACKEND_SERVER + "images/size"
