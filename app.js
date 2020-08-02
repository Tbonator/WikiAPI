//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/wikiDB";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const ArticleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("article", ArticleSchema);
///////////////////////////request targeting all Articles//////////////
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const NewArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    NewArticle.save((err) => {
      if (!err) {
        res.send("Successfully Added");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all the Articles");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////request targeting specific Articles///////
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    //const foundArticle = req.params.articleTitle;
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) res.send("successfully updated article");
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Articles.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted all the Articles");
      } else {
        res.send(err);
      }
    });
  });
  
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
