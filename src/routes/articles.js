const { default: mongoose } = require("mongoose");
const Article = require("../database/schemas/articleSchema");
const Profile = require("../database/schemas/profileSchema");

let articles = [
  { id: 0, author: "Mack", text: "Post 1", comment: [], date: new Date() },
  { id: 1, author: "Jack", text: "Post 2", comment: [], date: new Date() },
  { id: 2, author: "Zack", text: "Post 3", comment: [], date: new Date() },
];

function getArticle(req, res) {
  const username = req.username;
  const id = req.params.id; // req.params.id can be either post id or username

  if (id) {
    let articleId;
    let authorUsername;
    // post id or username provided
    if (mongoose.Types.ObjectId.isValid(id)) {
      // if req.params.id is a post id
      articleId = id;
      console.log("isID")
    } else {
      // if req.params.id is a username
      authorUsername = id;
      console.log("isUsername")
    }

    if (articleId) {
      // post id provided
      Article.find({ _id: articleId }, function (err, filteredArticle) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }

        let articleDB = filteredArticle[0];
        if (!articleDB) {
          return res.status(404).send("The article is not found");
        }
        res.status(200).send({
          articles: filteredArticle,
        });
      });
    } else {
      // username provided
      console.log("using username")
      Article.find({ author: authorUsername }, function (err, filteredArticle) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }

        let articleDB = filteredArticle[0];
        if (!articleDB) {
          return res.status(404).send("The article is not found");
        }
        res.status(200).send({
          articles: filteredArticle,
        });
      });
    }
  } else {
    // return an array of articles in the loggedInUser's feed
    Profile.find({ username: username }, function (err, profile) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      let profileDB = profile[0];
      if (!profileDB) {
        return res.status(404).send("The profile is not found");
      }

      let authors = profileDB.following;
      authors.push(username); // add logged in user (self) to the authors list

      Article.find({ author: { $in: authors } }, function (err, articles) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }

        let articleDB = articles[0];
        if (!articleDB) {
          return res.status(404).send("The article is not found");
        }
        res.status(200).send({
          articles: articles,
        });
      });
    });
  }
}

function updateArticle(req, res) {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .send("please provide the id of the article to update");
  }
  articles.filter((article) => {
    if (article.id == id) {
      article.text = req.body.text;
    }
  });
  res.status(200).send({
    articles: articles,
  });
}

function addArticle(req, res) {
  const username = req.username;
  const text = req.body.text; // A new article will arrive with only the text in the payload

  // supply text
  if (!text) {
    return res.status(400).send("text cannot be empty when adding an article");
  }

  const newArticle = new Article({
    author: username,
    text: text,
    date: new Date(),
    comments: [],
  });
  newArticle.save();

  Article.find({author: username}, function(err, articles) {
    let addedArticles = articles;
    addedArticles.push(newArticle);
    let msg = { articles: addedArticles };
    res.send(msg);
  })

  // let msg = { articles: [newArticle] };
  // res.send(msg);
}

module.exports = (app) => {
  app.get("/articles/:id?", getArticle);
  app.put("/articles/:id", updateArticle);
  app.post("/article", addArticle);
};
