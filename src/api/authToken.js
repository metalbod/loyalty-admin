// Plain-JS token store, deliberately outside React. api/client.js (the fetch interceptor)
// needs to read the current token and report 401s on every request, but it isn't a component
// and can't call useContext - and AuthContext, conversely, shouldn't need to know about fetch
// internals. This module is the seam between the two: AuthContext writes to it on
// login/logout, client.js reads from it on every request.
//
// The token itself lives ONLY in this module-level variable - it is never written to
// localStorage or sessionStorage. That's a deliberate security/UX tradeoff: an XSS payload
// that runs on this page can still read the variable at that moment, but it can't exfiltrate
// a persistent copy that outlives the page, and a full reload always clears it (the user has
// to log in again). localStorage would survive reloads but is a strictly larger XSS attack
// surface, so it's intentionally not used here.

let currentToken = null;
let unauthorizedHandler = () => {};

export function getToken() {
  return currentToken;
}

export function setToken(token) {
  currentToken = token;
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized() {
  unauthorizedHandler();
}
