import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLon, limit } = req.query;
    const response = await fetchCoffeeStores(latLon, limit);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.error("There is an error", error);
    res.status(500);
    res.json({ message: "Oh SHIT, something went wrong!", error });
  }
};

export default getCoffeeStoresByLocation;
