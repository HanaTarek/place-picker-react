// custom hook 
// must start with use 
//because functions start with use treated like a hook 
import { useEffect , useState } from "react";

export function useFetch(fetchFn , initalvalue){
       const [isFecting , setIsFecting] = useState();
       const [errorstate , setErrorstate] = useState();
       const [fetchedData , setFetchedData] = useState(initalvalue);

        useEffect(()=>{
        async function fetchdata() {
          setIsFecting(true);
          try{

          const data = await fetchFn();
          setFetchedData(data);

          }catch(error){
              setErrorstate({message : error.message || "failed to fetch data"})
          }
          setIsFecting(false)
        }
        fetchdata();

      },[fetchFn]);

      return {
        isFecting,
        errorstate,
        setFetchedData,
        fetchedData
      }

}