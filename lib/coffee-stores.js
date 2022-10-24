import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_APIKEY,
});

const getUrlForCoffeeStores = (query, latlon, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlon}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_SECRET}&radius=5000&limit=${limit}`;
};

const getListOfPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 40,
  });

  const photoResults = photos.response.results;
  return photoResults.map((result) => result.urls["regular"]);
};

export const fetchCoffeeStores = async (
  latLon = "40.78102712696545,-73.98038938020758",
  limit = 6
) => {
  const photos = await getListOfPhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_APIKEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores("coffee", latLon, limit),
    options
  );
  const data = await response.json();
  return data.results.map((result, index) => {
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address,
      neighborhood: result.neighborhood ? neighborhood[0] : "",
      imgUrl: photos.length > 0 ? photos[index] : null,
    };
  });

  //    .catch((err) => console.error(err));
};
