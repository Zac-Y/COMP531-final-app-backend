const md5 = require("md5");
const User = require("../database/schemas/userSchema");
const Profile = require("../database/schemas/profileSchema");
let sessionUser = {}; // users that logged in
let cookieKey = "sid";

let userObjs = {};

function isLoggedIn(req, res, next) {
  // likely didn't install cookie parser
  if (!req.cookies) {
    return res.sendStatus(401);
  }

  let sid = req.cookies[cookieKey];

  // no sid for cookie key
  if (!sid) {
    return res.sendStatus(401);
  }

  let username = sessionUser[sid];

  // no username mapped to sid
  if (username) {
    req.username = username; // ??
    next();
  } else {
    // console.log("test")
    return res.sendStatus(401);
  }
}

function register(req, res) {
  const { username, password, email, zipcode, dob } = req.body;

  // supply username and password
  if (!username || !password) {
    return res.sendStatus(400);
  }

  Profile.find({ username: username }, function (err, profiles) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    let profileDB = profiles[0];
    if (profileDB) {
      // username has been registered
      let msg = { username: username, result: "failure" };
      res.send(msg);
      // return res.status(500).send("The username has been registered");
    } else {
      let salt = username + new Date().getTime();
      let hash = md5(salt + password);

      const newUser = new User({
        username: username,
        salt: salt,
        hash: hash,
      });
      newUser.save();

      const newProfile = new Profile({
        username: username,
        headline: "Happy",
        email: email,
        zipcode: zipcode,
        dob: dob,
        avatar: "https://picsum.photos/300/200",
        following: [],
      });
      newProfile.save();

      let msg = { username: username, result: "success" };
      res.send(msg);
    }
  });
}

//9524b8e04a985b787dd763aec2b4f907
function login(req, res) {
  const { username, password } = req.body;

  // supply username and password
  if (!username || !password) {
    return res.sendStatus(400);
  }

  User.find({ username: username }, function (err, user) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    let userDB = user[0];
    // console.log(!userDB)
    if (!userDB) {
      // return res.status(404).send("The user is not registered");
      let msg = { username: username, result: "failure-not-registered" };
      res.send(msg);
    } else {
      let currHash = md5(userDB.salt + password); // generate hash from input password
      if (currHash === userDB.hash) {
        let sid = md5(username);
        sessionUser[sid] = username;

        // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        let msg = { username: username, result: "success" };
        res.send(msg);
      } else {
        let msg = { username: username, result: "failure-password-incorrect" };
        res.send(msg);
        // return res.status(401).send("password is incorrect");
      }
    }
  });
}

function logout(req, res) {
  delete sessionUser[req.cookies[cookieKey]];
  res.clearCookie(cookieKey);
  let msg = "OK";
  res.status(200).send(msg);
}

function updatePassword(req, res) {
  const { password } = req.body; // new password

  // supply new password
  if (!password) {
    return res.sendStatus(400);
  }

  let username = sessionUser[req.cookies[cookieKey]]; // get logged in user's username

  console.log(username);

  const newSalt = username + new Date().getTime();
  const newHash = md5(newSalt + password);
  console.log(newHash);
  User.updateOne(
    { username: username },
    { $set: { salt: newSalt, hash: newHash } },
    function (err) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      let sid = md5(username);
      sessionUser[sid] = username;

      // Adding cookie for session id
      res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
      let msg = { username: username, result: "success" };
      res.status(200).send(msg);
    }
  );
}

module.exports = (app) => {
  app.post("/register", register);
  app.post("/login", login);
  app.use(isLoggedIn);
  app.put("/logout", logout);
  app.put("/password", updatePassword);
};
