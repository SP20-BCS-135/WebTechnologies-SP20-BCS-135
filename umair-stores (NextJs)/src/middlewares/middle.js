import { NextResponse } from "next/server";

const middle = (handler) => async (req, res) => {
  const { method } = req;
  console.log("Passing from 222 mw", method);
  return handler(req, res);
};

export default middle;
