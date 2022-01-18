import * as route from '../config/Routes';

export const SET_SESSION_TOKEN = "SET_SESSION_TOKEN";

export function setSessionTokenAction(sessionToken){
    return {
        type: SET_SESSION_TOKEN,
        sessionToken: sessionToken
    }
}

/**
 * This function fetches the Session Token
 * @returns Token
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
            console.log("Session Token: " + key)
            setSessionToken(key)
            return callback(key)
        }
    })
}

/**
 * @param sessionToken 
 * This function dispatches the setSessionTokenAction.
*/
export function setSessionToken(sessionToken) {
    return dispatch => {
        dispatch(setSessionTokenAction(sessionToken));
    }
}