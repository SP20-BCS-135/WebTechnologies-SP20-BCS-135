import {
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Icon from "feather-icons-react";
import { useDispatch } from "react-redux";
import { setUser } from "../src/store/Slices/userSlice";
const Productdetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selected, setSelected] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [size, setSize] = React.useState("");
  const [color, setColor] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);

  const fetchData = async () => {
    const { id } = router.query;
    try {
      let res = await fetch(
        `http://localhost:3000/api/products/getproduct?id=${id}`,
        {
          method: "GET",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
        }
      );

      const prod = await res.json();
      setData(prod);
    } catch (e) {
      console.log("Umair err is", e);
    }
  };
  const onPress = () => {
    dispatch(setUser({ name: "umair", email: "abc@gmail.com" }));
  };

  useEffect(() => {
    if (router.isReady) fetchData();
  }, [router.isReady]);
  if (!data)
    return (
      <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={60} />
        <Skeleton variant="rounded" width={210} height={60} />
      </Stack>
    );

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container py-5 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              {data?.seller}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
              {data?.brand}
            </h1>
            <div className="flex mb-4">
              <a className="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">
                Description
              </a>
            </div>
            <p className="leading-relaxed mb-4">{data?.description}</p>
            <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">Color</span>
              <span className={`ml-auto flex my-3`}>
                {data.colors?.map((c, i) => {
                  return (
                    <div
                      onClick={() => {
                        setSelected(c);
                        setColor(c);
                      }}
                      key={i}
                      className={`h-6 w-6 rounded-3xl ml-1`}
                      style={{
                        backgroundColor: c,
                        outlineStyle: selected === c ? "solid" : "none",
                      }}
                    ></div>
                  );
                })}
              </span>
            </div>
            <div className="flex border-t border-gray-200 py-2">
              <span className="text-gray-500">Size</span>
              <FormControl className="ml-auto text-gray-900">
                <InputLabel id="demo-simple-select-label">select</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  sx={{ width: "10rem" }}
                  value={size}
                  label="size"
                  onChange={(e) => {
                    setSize(e.target.value);
                  }}
                >
                  {data.sizes?.map((s, i) => (
                    <MenuItem key={i} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex border-t border-b mb-6 border-gray-200 py-2">
              <span className="text-gray-500">Quantity</span>
              <span className="ml-auto flex text-gray-900">
                <button
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity === 1 ? true : false}
                >
                  <Icon
                    icon="minus-circle"
                    className="text-indigo-500 hover:text-indigo-700"
                  />
                </button>
                <span className="mx-2">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <Icon
                    icon="plus-circle"
                    className="text-indigo-500 hover:text-indigo-700"
                  />
                </button>
              </span>
            </div>
            <div className="">
              <div className="mb-2">
                <span className="title-font font-medium text-2xl text-gray-900">
                  ${data.discountedPrice ? data.discountedPrice : data.price}
                </span>
                {data.discountedPrice ? (
                  <span className="title-font text-sm ml-2 line-through text-gray-900">
                    ${data.price}
                  </span>
                ) : null}
              </div>
              <button
                onClick={onPress}
                className=" text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
              >
                Add to cart
              </button>
              <button className=" text-white bg-indigo-500 ml-2 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                Buy now
              </button>
              {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button> */}
            </div>
          </div>
          <CardMedia
            className="lg:w-1/2 w-full "
            component="img"
            image={
              data.images
                ? data.images[0]
                : "https://www.kirkstall.com/wp-content/uploads/2020/04/image-not-available-png-8.png"
            }
            alt="img"
          />
        </div>
      </div>
    </section>
  );
};

export default Productdetail;
