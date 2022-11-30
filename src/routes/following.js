const Profile = require("../database/schemas/profileSchema");

const following = [
  {
    username: "aaa",
    following: ["bbb", "ccc"],
  },
  {
    username: "bbb",
    following: ["aaa", "ddd"],
  },
  {
    username: "ccc",
    following: ["aaa", "bbb", "ddd"],
  },
];

function getFollowing(req, res) {
  const username = req.params.user ? req.params.user : req.username;
  const userFollowing = following.filter((user) => {
    return user.username == username;
  })[0].following;

  res.send({ username: username, following: userFollowing });
}

function updateFollowing(req, res) {
  const username = req.username; // logged in user's username
  const newFollow = req.params.user; // new follow to be added
  let userFollowing = following.filter((user) => {
    return user.username == username;
  })[0].following;

  if (!userFollowing.includes(newFollow)) {
    userFollowing.push(newFollow);
  }

  res.status(200).send({
    username: username,
    following: userFollowing,
  });
}

function deleteFollowing(req, res) {
  const username = req.username; // logged in user's username
  const newUnfollow = req.params.user; // new follow to be deleted
  let userFollowing = following.filter((user) => {
    return user.username == username;
  })[0].following;

  if (userFollowing.includes(newUnfollow)) {
    userFollowing = userFollowing.filter((user) => {
      return user != newUnfollow;
    });
  }

  res.status(200).send({
    username: username,
    following: userFollowing,
  });
}

module.exports = (app) => {
  app.get("/following/:user?", getFollowing);
  app.put("/following/:user", updateFollowing);
  app.delete("/following/:user", deleteFollowing);
};
