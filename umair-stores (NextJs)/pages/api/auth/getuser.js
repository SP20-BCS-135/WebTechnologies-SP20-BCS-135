import Authenticate from "../../../src/middlewares/authenticate";
import connectMongo from "../../../src/middlewares/connectDB";
import User from "../../../src/models/user";

// ⚠ BACKEND VALIDATION PENDING (YUP)  <==

const handler = (req, res) => {
  // switch case for different http methods
  switch (req.method) {
    //Getting the user Info GET /api/auth/getuser : login (Tokened) required

    case "GET": {
      User.findById(req.user.id, (error, user) => {
        if (error) res.status(500).send({ success: false, error });
        res.status(200).send(user);
      }).select("-password");
      break;
    }

    default:
      return res.status(405).send({ error: "Method not allowed" });
  }
};

export default connectMongo(Authenticate(handler));
