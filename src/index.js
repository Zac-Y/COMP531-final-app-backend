const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth.js");
const profile = require("./routes/profile.js")
const articles = require("./routes/articles.js")
const following = require("./routes/following.js")
// const mongoose = require("mongoose");
// const userSchema = require("./userSchema");
// const User = mongoose.model("user", userSchema);
const User = require('./database/schemas/userSchema');
const profileSchema = require("./database/schemas/profileSchema.js");
// const connectionString =
//   "mongodb+srv://comp531:Zachary0312@cluster0.agu3tfk.mongodb.net/hw6?retryWrites=true&w=majority";


// mongoose.connect(connectionString).then(
//     ()=>{
//         console.log("connected to DB")
//     }
// ).catch(
//     (err)=>{
//         console.log(err)
//     }
// )

// let articles = [
//   { id: 0, author: "Mack", body: "Post 1" },
//   { id: 1, author: "Jack", body: "Post 2" },
//   { id: 2, author: "Zack", body: "Post 3" },
// ];

const hello = (req, res) => res.send({ hello: "world" });

// const addUser = (req, res) => {
//   (async () => {
//     const connector = mongoose.connect(connectionString, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
    
//     const newUser = await User.create(
//         {
//             username: req.params.uname,
//             created: Date.now()
//         }
//     )
//     newUser.save();
//     res.send({name: req.params.uname});
//   })();
// };

// const getArticles = (req, res) => res.send(articles);

// // TODO: get the correct article by using the id
// const getArticle = (req, res) => res.send(articles[req.params.id]);

// const addArticle = (req, res) => {
//   // TODO: add an article (i.e. push new article on existing article array)
//   let post = req.body;
//   let article = {
//     id: articles.length,
//     author: post.author,
//     body: post.body,
//   };
//   articles.push(article);
//   res.send(articles);
// };

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/", hello);

// app.post("/users/:uname", addUser); // req.params.uname

auth(app);

profile(app);
articles(app);
following(app);

// app.get("/articles", getArticles);
// app.get("/articles/:id", getArticle);
// app.post("/article", addArticle);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const addr = server.address();
  console.log(`Server listening at http://${addr.address}:${addr.port}`);
});
