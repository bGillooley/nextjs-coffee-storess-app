import { useContext, useState } from "react";

import { ACTION_TYPES, StoreContext } from "../store/coffee-store.context";

const useTrackLocation = () => {
  //const [latLon, setLatLon] = useState("");
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPES.SET_LAT_LON,
      payload: { latLon: `${latitude},${longitude}` },
    });
    //setLatLon(`${latitude},${longitude}`);
    setLocationErrorMsg("");
    setIsLoading(false);
  };

  const error = () => {
    setIsLoading(false);
    setLocationErrorMsg("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  return {
    //latLon,
    handleTrackLocation,
    locationErrorMsg,
    isLoading,
  };
};

export default useTrackLocation;
