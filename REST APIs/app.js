import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
// import https from "https";
// import _ from "lodash";

mongoose
  .connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connection Succesful");
  })
  .catch((e) => {
    console.log("Something went wrong Umair ! : ", e);
  });

const schema = new mongoose.Schema({
  title: String,
  content: String,
});
let Article = mongoose.model("articles", schema);

const app = express();
app.set("view engine", "ejs"); // to incl EJS
app.use(express.static("public")); // to incl css,images,js files
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const currentPath = path.resolve();

app
  .route("/articles")
  .get(async (req, res) => {
    Article.find((e, articles) => {
      e ? res.send(e) : res.send(articles);
    });
  })

  .post((req, res) => {
    let newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => res.send("Post request successful 💯"))
      .catch((e) => res.send(e));
  })
  .delete((req, res) => {
    Article.deleteMany()
      .then(() => res.send("Deleted all Articles💯"))
      .catch((e) => res.send(e));
  });

app
  .route("/articles/:param")
  .get((req, res) => {
    Article.findOne({ title: req.params.param }, (e, articles) => {
      e ? res.send(e) : res.send(articles);
    });
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.param }, function (e) {
      e ? res.send(e) : res.send("Deleted Successfully 💯");
      // deleted at most one Article document
    });
  })

  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.param },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (e, docs) => {
        if (e) res.send(e);
        else if (docs) res.send("put req successful");
        else res.send("No such data found");
      }
    );
  })

  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.param },
      { $set: req.body },
      (e, docs) => {
        if (e) res.send(e);
        else if (docs) res.send("PATCH req successful");
        else res.send("No such data found");
      }
    );
  });

app.listen(port, () => console.log("Server running Success"));
