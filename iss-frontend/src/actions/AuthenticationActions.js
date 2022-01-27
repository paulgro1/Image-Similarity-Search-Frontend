import * as route from '../config/Routes';

export const SET_SESSION_TOKEN = "SET_SESSION_TOKEN";

/**
 * This function accepts a session token and returns an action object.
 * @param {string} sessionToken 
 * @returns {object}
 */

export function setSessionTokenAction(sessionToken){
    return {
        type: SET_SESSION_TOKEN,
        sessionToken: sessionToken
    }
}

/**
 * Callback for returning the session key.
 * @callback returnKeyCallback
 * @param {string} key - the session key
 */

/**
 * This function fetches the session token.
 * @param {returnKeyCallback} callback - a callback to run
 * @returns {function} callback wich returns the key
 */
 export async function getSessionToken(callback) {
    
    var restUrl = route.AUTHENTICATE;
    console.log("Getting session token from: " + restUrl);

    await fetch(process.env.REACT_APP_BACKEND_SERVER + "/authenticate", {
        method: "GET",
    })
    .then(response => {
        if(!response){
            console.log("Getting token failed")
        }
        if(response.headers.has("api-session-token")){
            let key = response.headers.get("api-session-token")
            setSessionToken(key)
            return callback(key)
        }
    })
}

/**
 * This function dispatches the setSessionTokenAction with the session token.
 * @param {string} sessionToken - the session token
 * @returns {function} dispatch - a function that dispatches the action
 * 
*/
export function setSessionToken(sessionToken) {
    return dispatch => {
        dispatch(setSessionTokenAction(sessionToken));
    }
}