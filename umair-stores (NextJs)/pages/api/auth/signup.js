import connectMongo from "../../../src/middlewares/connectDB";
import User from "../../../src/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ⚠ BACKEND VALIDATION PENDING (YUP)  <==

const handler = (req, res) => {
  // switch case for different http methods
  switch (req.method) {
    //Registering a user POST /api/auth/signup :No login required

    case "POST": {
      const { name, email, password, gender } = req.body;

      User.findOne({ email }, (error, docs) => {
        if (error) res.status(500).send({ success: false, error });
        if (docs) res.json({ success: false, error: "Email already exists" });
        else
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hashedPass) {
              User.create({
                name,
                email,
                gender,
                password: hashedPass,
              }).then((user) => {
                //data that will be encapsulated in the jwt token
                let data = { user: { id: user._id } };
                //Auth jwt token to send user to make every req with this token
                let authToken = jwt.sign(data, process.env.SECRET_KEY);
                res.status(200).send({ success: true, authToken });
              });
            });
          });
      });
      break;
    }

    default:
      return res.status(405).send({ error: "Method not allowed" });
  }
};

export default connectMongo(handler);
