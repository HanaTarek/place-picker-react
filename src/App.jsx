import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';
import Error from './components/Error.jsx';
import { useFetch } from './hooks/useFetch.js';

//// rules of hooks /////
// only call hooks inside of component functions 
// only call hooks on the top level ( msh gwa loop aw if condition )
// ynf3 n7ot hook  gwa custom hook
// why do we build custom hooks ??
// wrapp and re use code that goes into my function 
// 
// in the app we got a useffect to fetch user places and in the avaiable places we got the same idea of useeffect 
// so this could be an example to take this hook and make it generic to re use it 


// i cannot take it to A SEPARATE FUNCTION BECAUSE HOOKS CAN'T BE IN A NON COMPONENT FUNCTIONS 



// function fetchDaya(){
//   useEffect(()=>{
//     async function fetchUserplaces() {
//       setIsFecting(true);
//       try{
//       const places = await fetchUserPlaces();
//       setUserPlaces(places);
//       console.log("user places : " , places)
//       }catch(error){
//           setErrorstate({message : error.message || "failed to fetch places"})
//       }
//       setIsFecting(false)
//     }
//     fetchUserplaces();
//   },[]);
// }



function App() {
  const selectedPlace = useRef();


  const [modalIsOpen, setModalIsOpen] = useState(false);

  const  [errorUpdatingPlaces , seterrorUpdatingPlaces ] = useState();


  
  const { isFecting , errorstate : Errorstate,setFetchedData : setUserPlaces , fetchedData : userPlaces } = useFetch(fetchUserPlaces , [] );



  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;

  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

 async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    //this will not work because userplaces will not be updated yet
    // updateUserPlaces(userPlaces);
    try{
      //a7na kda mstkhdmen optimistic update 3shan bn update al variable gwa react 
      // at the same time m3a sending al request f 3shan kda asmo optimistic f lw fashal bn rg3 al data zy mkant gwa al catch w bn show an error 
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    }
    catch(error){
      //...

      setUserPlaces(userPlaces);
      seterrorUpdatingPlaces({message : error.message || "failed to update places"})
    }
   
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try{
    await updateUserPlaces(
      userPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    }catch(error){
      setUserPlaces(userPlaces);
      seterrorUpdatingPlaces({
        message: error.message || "Failed to delete place."
      });
    }

    setModalIsOpen(false);
  }, [userPlaces]);


  function handleErrror(){
    seterrorUpdatingPlaces(null);
  }

  return (
    <>
    {/* lazm nshghal handle error 3l modal w 3l error 3shan al atneen dyman mwgoden fl dom 7ata lw msh zhren */}
    <Modal open={errorUpdatingPlaces} onClose={handleErrror}>
      {errorUpdatingPlaces && (
      <Error title="An Error Occurred!" 
      message={errorUpdatingPlaces.message} 
      onConfirm={handleErrror}>
      </Error>
        )}
    </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {Errorstate && <Error  title="An Error Occurred!" 
      message={Errorstate.message} />}
        <Places
          title="I'd like to visit ..."
           isLoading= {isFecting}
           LoadingText="Fetching your places..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
