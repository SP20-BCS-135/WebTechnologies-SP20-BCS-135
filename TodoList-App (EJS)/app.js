import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import _ from "lodash";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import GS from "passport-google-oauth20";
const GoogleStrategy = GS.Strategy;
import findOrCreate from "mongoose-findorcreate";

const app = express();
app.set("view engine", "ejs"); // to incl EJS
app.use(express.static("public")); // to incl css,images,js files
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const currentPath = path.resolve();

//User auth------------------------------
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(
    "mongodb+srv://admin-umair:test123@cluster0.xg387ne.mongodb.net/todoListDB",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Connection Succesful");
  })
  .catch((e) => {
    console.log("Something went wrong Umair ! : ", e);
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
});

const schema = new mongoose.Schema({
  todo: String,
  userId: String,
});

const listSchema = new mongoose.Schema({
  todo: String,
  userId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

let User = new mongoose.model("User", userSchema);
let lists = mongoose.model(`ListName`, listSchema);
let Todo;

passport.use(User.createStrategy());
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "https://rocky-thicket-93944.herokuapp.com/auth/google/Todos",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// res.render("index", { title: "Add a new Todo List 🔔" });
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index", { title: "Add a new Todo List 🔔" });
  } else res.redirect("/login");
});

app.post("/", (req, res) => {
  let domainName = req.body.listName;
  const newlist = new lists({ todo: domainName, userId: req.user?.id });
  newlist.save().then(() => console.log("saved to lists"));

  res.redirect("/" + domainName);
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    let verifyUser = new User({
      email: req.body.username,
      password: req.body.password,
    });

    req.login(verifyUser, (e) => {
      if (e) {
        console.log("Error in /login: POST: " + e);
        res.redirect("/register");
      } else {
        passport.authenticate("local", {
          failureRedirect: "/login",
          failureMessage: true,
        })(req, res, () => {
          res.redirect("/");
        });
      }
    });
  });

app.get("/logout", (req, res) => {
  req.logout((e) => {
    if (e) console.log(e);
    else res.redirect("/");
  });
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      (e, regUser) => {
        if (e) {
          console.log(e);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, () => {
            res.redirect("/");
          });
        }
      }
    );
  });

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/Todos",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/:param", (req, res) => {
  Todo = mongoose.model(req.params.param, schema);

  Todo.find({ userId: req.user?.id }, (e, todoList) => {
    if (e) console.log(e);
    else
      res.render("customList", {
        check: todoList,
        dateToDay: req.params.param,
      });
  });
});

app.post("/:param", (req, res) => {
  if (req.body.chkbox) {
    Todo = mongoose.model(req.params.param, schema);
    Todo.deleteOne({ _id: req.body.chkbox }, (e) => {
      e ? console.log(e) : res.redirect(`/${req.params.param}`);
    });
  } else {
    Todo = mongoose.model(req.params.param, schema);
    const newTodoItem = new Todo({
      todo: req.body.newTodo,
      userId: req.user.id,
    });
    newTodoItem.save().then(() => res.redirect(`/${req.params.param}`));
  }
});

app.get("/listNames/lists", (req, res) => {
  lists.find({ userId: req.user.id }, (e, listNames) => {
    if (e) console.log(e);
    else res.render("listNames", { check: listNames });
  });
});

app.listen(port, () => console.log("Server running Success"));
