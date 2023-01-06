import mongoose from "mongoose";

const connectMongo = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) return handler(req, res);
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected");
      return handler(req, res);
    });
  } catch (error) {
    console.log(error);
  }
};

export default connectMongo;
