const Profile = require("../database/schemas/profileSchema");

const profile = {
  username: "DLeebron",
  headline: "This is my headline!",
  email: "foo@bar.com",
  zipcode: 12345,
  dob: "128999122000",
  avatar:
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg",
};

function getHeadline(req, res) {
  const username = req.params.user ? req.params.user : req.username;

  Profile.find({ username: username }, function (err, profile) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    let profileDB = profile[0];
    if (!profileDB) {
      return res.status(404).send("The headline is not found");
    }

    // console.log(profileDB.headline)
    let msg = { username: username, headline: profileDB.headline };
    res.send(msg);
  });
}

function updateHeadline(req, res) {
  const { headline } = req.body;
  const username = req.username;

  Profile.updateOne(
    { username: username },
    { $set: { headline: headline } },
    function (err) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      let msg = { username: username, headline: headline };
      res.status(200).send(msg);
    }
  );
}

function getEmail(req, res) {
    res.send({ username: profile.username, email: profile.email })
}

function updateEmail(req, res) {
    const { email } = req.body;
    profile.email = email;
    res.send({ username: profile.username, email: profile.email })
}

function getDob(req, res) {
    res.send({ username: profile.username, dob: profile.dob })
}

function getZipcode(req, res) {
    res.send({ username: profile.username, zipcode: profile.zipcode })
}

function updateZipcode(req, res) {
    const { zipcode } = req.body;
    profile.zipcode = zipcode;
    res.send({ username: profile.username, zipcode: profile.zipcode })
}

function getAvatar(req, res) {
    res.send({ username: profile.username, avatar: profile.avatar })
}

function updateAvatar(req, res) {
    const { avatar } = req.body;
    profile.avatar = avatar;
    let picture = '<img src={profile.avatar}></img>';
    res.send({ username: profile.username, avatar: picture })
}

module.exports = (app) => {
  app.get("/headline/:user?", getHeadline);
  app.put("/headline", updateHeadline);
  app.get("/email/:user?", getEmail);
  app.put("/email", updateEmail);
  app.get("/dob/:user?", getDob);
  app.get("/zipcode/:user?", getZipcode);
  app.put("/zipcode", updateZipcode);
  app.get("/avatar/:user?", getAvatar);
  app.put("/avatar", updateAvatar);
};
