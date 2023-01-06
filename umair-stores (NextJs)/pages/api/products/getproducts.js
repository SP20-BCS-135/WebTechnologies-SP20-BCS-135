import connectMongo from "../../../src/middlewares/connectDB";
import middle from "../../../src/middlewares/middle";
import products from "../../../src/models/products";

const handler = (req, res) => {
  // switch case for different http methods
  const { qty } = req.query;
  switch (req.method) {
    case "GET": {
      // get products from database and send it to client side
      products
        .find({}, (err, products) => {
          if (err) return res.status(500).send(err);
          else return res.status(200).send(products);
        })
        .limit(qty)
        .sort({ _id: 1 }); // sort products by id in acscending order
      break;
    }

    default:
      return res.status(405).send({ error: "Method not allowed" }); // if method is not get then send error message
  }
};

export default connectMongo(handler);
