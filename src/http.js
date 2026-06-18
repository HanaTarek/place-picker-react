export async function fetchAvaiablePlaces() {
    
    const response = await fetch('http://127.0.0.1:3000/places');
        const resData = await response.json();
    
        if(!response.ok){
          throw new Error('Failed to fetch places');
        }
    
    return resData.places;
}

export async function fetchUserPlaces() {
    
    const response = await fetch('http://127.0.0.1:3000/user-places');
        const resData = await response.json();
    
        if(!response.ok){
          throw new Error('Failed to fetch user places');
        }
    
    return resData.places;
}

// async means this function works with asynchronous code
// and automatically returns a Promise
export async function updateUserPlaces(places) {

    // fetch() sends an HTTP request to the backend API
    // here we send a PUT request to update the user's places
    // PUT is commonly used to update existing data on the server
    const response = await fetch('http://127.0.0.1:3000/user-places', {

        // configure the type of request
        method: 'PUT',

        // body contains the data we want to send to the backend
        // JavaScript objects/arrays cannot be sent directly in HTTP requests
        // so we convert the places array/object into JSON text
        body: JSON.stringify({ places : places}),

        // headers provide extra information about the request
        // Content-Type tells the backend that the body contains JSON data
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // response.json() reads the response body
    // and converts the JSON text returned by the backend
    // into a normal JavaScript object
    const resData = await response.json();

    // fetch() does NOT automatically throw errors for
    // HTTP status codes like 404 or 500
    // so we manually check if the request failed
    if (!response.ok) {

        // throw creates a custom error object
        // this can later be caught in a try/catch block
        throw new Error('Failed to update user data.');
    }

    // if everything worked successfully,
    // return the success message sent by the backend
    // example:
    // { message: 'User places updated!' }
    return resData.message;
}