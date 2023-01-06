import { Grid } from "@mui/material";
import Head from "next/head";
import ProductCard from "../src/components/ProductCard";
import productModel from "../src/models/products";

import { useState } from "react";
import mongoose from "mongoose";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
// let prop = {
//   _id: 23232,
//   price: 20000.34,
//   discountedPrice: 15000,
//   ratings: 3,
//   reviews: ["Good product"],
//   brand: "The Futurists",
//   colors: ["Black", "red"],
//   sizes: [41, 42, 43],
//   inStock: 300,
//   seller: "Ali Raza",
//   waranty: "Two years",
//   catagory: "Footwear",
//   description: "Spark 8C 6.56HD Dot-in* IPS Display 128GB ROM + 4GB RAM , Rear",
//   images: ["https://static-01.daraz.pk/p/d962db3287bc488515d6972343190259.jpg"],
//   // shippingPrice: 10,
// };

export default function Home({ products, totalProducts }) {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState(products);
  const fetchData = async () => {
    try {
      let res = await fetch(
        `http://localhost:3000/api/products/getproducts?qty=${
          data?.length + 5
        }`,
        {
          method: "GET",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
        }
      );

      const prods = await res.json();
      setData(prods);
    } catch (e) {
      console.log("Umair err is", e);
    }
  };

  return (
    <div>
      <Head>
        <title>umair-Stores</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{user ? user.name : "Plz login"}</h1>
        <InfiniteScroll
          dataLength={data?.length}
          next={fetchData}
          hasMore={true}
          loader={
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
              {data?.length === totalProducts
                ? "No more products"
                : "Loading..."}
            </h2>
          }
        >
          <Grid container spacing={2} alignItems={"center"}>
            {data?.map((item, i) => (
              <ProductCard item={item} key={i} />
            ))}
          </Grid>
        </InfiniteScroll>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  mongoose.connect(process.env.MONGO_URI);
  let totalProducts = await productModel.estimatedDocumentCount();
  let products = await productModel.find().limit(8);

  return {
    props: { products: JSON.parse(JSON.stringify(products)), totalProducts }, // will be passed to the page component as props
  };
}