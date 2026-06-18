import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvaiablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';
// if the http request take time the component doesn't wait for it
// so we need to start with an empty array until the data is avaiable 
// and then use it 

async function fetchSortedPlaces() {

  const places = await fetchAvaiablePlaces();

  return new Promise((resolve)=>{

    navigator.geolocation.getCurrentPosition((position) => {
    const sortedPlaces = sortPlacesByDistance(
      places,
      position.coords.latitude,
      position.coords.longitude
    );

    resolve(sortedPlaces);
  });

  });
  
}

export default function AvailablePlaces({ onSelectPlace }) {

  // const [isFetching , setIsFecting] = useState(false);
  // const [availablePlaces , setAvailablePlaces] = useState([]);
  // const [Errorstate , setErrorstate] = useState();


  //using the custom hook

  const { isFecting : isFetching, errorstate : Errorstate,setFetchedData : setAvailablePlaces , fetchedData : availablePlaces } = useFetch(fetchSortedPlaces , [] );




  // FETCH is a function not provided by react but by the browser

  
  //fetch return a promise (a wrapper object)
  //the .then will not run immediatly but when the data is available
  // fetch('http://localhost:3000/places').then((response)=>{
  //   return response.json()
  // }).then((resData) =>{
  //   setAvailablePlaces(resData.places);
  // }) 
  //this would create an infinite loop because once we get the data w set the state so the component re run so
  //  fetch again and so on and so forth
  // i know we need to use use effect =D


  // THE SOLUTION TO THE INFINITE LOOP 

  // useEffect(()=>{
  //   console.log("useeffect")
  // fetch('http://127.0.0.1:3000/places').then((response)=>{
  //   return response.json()
  // }).then((resData) =>{
  //   setAvailablePlaces(resData.places);
  // }) 
  // console.log("available" , availablePlaces);
  // },[]);

  // USING ASYNC AND AWAIT WAAY WHICH IS BETTER



  // useEffect(()=>{
  //   setIsFecting(true);
  // async function fetchPlaces(){

  //   try{

  //   const places = await fetchAvaiablePlaces();

  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const sortedPlaces = sortPlacesByDistance(
  //       places,
  //       position.coords.latitude,
  //       position.coords.longitude
  //     );
  //      setAvailablePlaces(sortedPlaces);
  //      setIsFecting(false);
  //  });

  // }
  // catch(error){
  //   setErrorstate(error)
  //   setIsFecting(false);
  // }
  // // set is fetching here will be set to false and the data will not be sorted yet 
  // // and its not possible to but await on the navigator function
  // // so we will change its place to be in the try and the catch
  // // setIsFecting(false);
  // }

  // fetchPlaces();

  // },[]);

  if(Errorstate){
    return <Error title="An Error Occurred!" message={Errorstate.message || "There is an error in fetching the data try again later"} ></Error>
  }

  //but the component function must contains an async but its not available for the component functions to have async
  // const response = await fetch('http://localhost:3000/places')
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading= {isFetching}
      LoadingText="Fetching place data..."
      // hena lma grbna al network w 3mlna slow 4g al data akhdt wa2t kber w mknsh ui kwys khales 
      // fkrt anina ktben no available places kda f hn3ml loading
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
