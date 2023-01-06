import connectMongo from "../../../src/middlewares/connectDB";
import products from "../../../src/models/products";

const handler = (req, res) => {
  // switch case for different http methods
  const { id } = req.query;
  switch (req.method) {
    case "GET": {
      products.findOne({ _id: id }, (err, products) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(products);
      });
      break;
    }

    default:
      return res.status(405).send({ error: "Method not allowed" });
  }
};

export default connectMongo(handler);
