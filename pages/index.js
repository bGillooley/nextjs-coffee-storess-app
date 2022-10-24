import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Banner from "../components/banner";
import Image from "next/image";
import Card from "../components/card";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import { ACTION_TYPES, StoreContext } from "../store/coffee-store.context";

import styles from "../styles/Home.module.css";

export async function getStaticProps(context) {
  const data = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores: data,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isLoading } =
    useTrackLocation();

  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setcoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLon } = state;

  useEffect(() => {
    async function setCoffeeStoreByLocation() {
      if (latLon) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLon=${latLon}&limit=30`
          );
          const coffeeStores = await response.json();
          //setCoffeeStores(fetchedCoffeeStores);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: coffeeStores,
            },
          });
        } catch (error) {
          // set error
          console.error({ error });
          setcoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoreByLocation();
  }, [latLon]);

  const handleOnBannerClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Discover Coffee Stores</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isLoading ? "loading..." : "Find Coffee Nearby"}
          handleOnClick={handleOnBannerClick}
        />
        {locationErrorMsg && <p>Some shit went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Some shit went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Photo of Coffee Shop"
          />
        </div>

        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={coffeeStore.id}
                    key={coffeeStore.id}
                  />
                );
              })}
            </div>
          </>
        )}

        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>New York Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={coffeeStore.id}
                    key={coffeeStore.id}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}