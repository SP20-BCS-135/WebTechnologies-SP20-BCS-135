import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Rating,
} from "@mui/material";
import { useRouter } from "next/router";

let discount = (originalPrice, discountedPrice) => {
  return Math.floor(((originalPrice - discountedPrice) / originalPrice) * 100);
};

function ProductCard({ item }) {
  const router = useRouter();
  const {
    price,
    discountedPrice,
    ratings,
    reviews,
    images,
    shippingPrice,
    description,
    _id,
  } = item;
  return (
    <Card
      sx={{ width: 200, alignSelf: "center" }}
      onClick={() =>
        router.push({ pathname: "/productdetail", query: { id: _id } })
      }
    >
      <CardActionArea>
        <CardMedia component="img" image={images[0]} alt="img" />
        <CardContent>
          <Typography
            className="title--wFj93"
            sx={{ fontWeight: 500, fontSize: "11px", color: "#108ee9" }}
          >
            {description}
          </Typography>
          <Typography className="price--NVB62">
            Rs. {discountedPrice ? discountedPrice : price}
          </Typography>
          {!shippingPrice ? (
            <CardMedia
              sx={{ width: "25.7143px", height: "16px", margin: "5px 0" }}
              component="img"
              image={
                "https://laz-img-cdn.alicdn.com/tfs/TB1QTkMXG67gK0jSZFHXXa9jVXa-45-28.png"
              }
              alt="img"
            />
          ) : null}
          {discountedPrice ? (
            <>
              <Typography
                className="priceExtra--ocAYk"
                sx={{
                  textDecoration: "line-through",
                  marginRight: "5px",
                  display: "inline-block",
                  fontSize: "10px",
                }}
              >
                Rs. {price}
              </Typography>
              <Typography
                className="priceExtra--ocAYk"
                sx={{ fontSize: "10px", display: "inline-block" }}
              >
                {discount(price, discountedPrice)}%
              </Typography>
              <br />
            </>
          ) : null}

          {ratings ? (
            <Rating
              name="simple-controlled"
              readOnly
              value={ratings}
              sx={{ fontSize: "12px" }}
            />
          ) : null}
          <Typography
            className="priceExtra--ocAYk"
            sx={{
              display: "inline-block",
              fontSize: "10px",
              position: "relative",
              bottom: "2px",
              left: "2px",
            }}
          >
            ({reviews.length})
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ProductCard;
