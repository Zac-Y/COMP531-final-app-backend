require("es6-promise").polyfill();
require("isomorphic-fetch");

const url = (path) => `http://localhost:3000${path}`;

let cookie;
let prevNumOfArticles;
let testUser = {
  username: "testUsername",
  password: "123",
};

// POST /register register new user
// POST /login log in user
// PUT /logout log out current logged in user
// GET /headline return headline for logged in user
// PUT /headline update logged in user headline
// GET /articles returns articles of logged in user
// GET /articles/id (where id is a valid or invalid article id)
// POST /article (adding an article for logged in user returns list of articles with new article, validate list increased by one and contents of the new article)

describe("Validate Registration, Login, and Logout functionality", () => {
  // register
  it("register new user", (done) => {
    console.log("1");
    fetch(url("/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.username).toEqual("testUsername");
        expect(res.result).toEqual("success");
        console.log("register tested");
        done();
      })
      .catch((err) => console.log(err));
  });
  // console.log("eeeee")
  // login
  it("login user", (done) => {
    console.log("2");
    fetch(url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    })
      .then((res) => {
        cookie = res.headers.get("set-cookie");
        return res.json();
      })
      .then((res) => {
        expect(res.username).toEqual("testUsername");
        expect(res.result).toEqual("success");
        console.log("login tested");
        done();
      })
      .catch((err) => console.log(err));
  });

  // logout
  it("logout user", (done) => {
    console.log("3");
    fetch(url("/logout"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.status;
      })
      .then((res) => {
        expect(res).toEqual(200);
        console.log("logout tested");
        done();
      })
      .catch((err) => console.log(err));
  });
});

describe("Validate headline functionality", () => {
  beforeEach((done) => {
    console.log("4");
    fetch(url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    })
      .then((res) => {
        cookie = res.headers.get("set-cookie");
        res.json();
      })
      .then((res) => {
        console.log("cookie passed");
        done();
      })
      .catch((err) => console.log(err));
  });

  // get headline
  it("get the headline for a user", (done) => {
    console.log("5");
    fetch(url("/headline/testUsername"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.headline).toEqual("Happy");
        console.log("get headline tested");
        done();
      })
      .catch((err) => console.log(err));
  });

  // update headline
  it("update the headline for the logged in user", (done) => {
    console.log("6");
    let newHeadline = { headline: "Sad" };
    fetch(url("/headline"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(newHeadline),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.headline).toEqual("Sad");
        console.log("update headline tested");
        done();
      })
      .catch((err) => console.log(err));
  });

  // change headline back to default so that running test again will not cause errors
  it("update the headline for the logged in user", (done) => {
    let newHeadline = { headline: "Happy" };
    fetch(url("/headline"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(newHeadline),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("headline changed back to default");
        done();
      })
      .catch((err) => console.log(err));
  });
});

describe("Validate articles functionality", () => {
  beforeEach((done) => {
    console.log("4");
    fetch(url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    })
      .then((res) => {
        cookie = res.headers.get("set-cookie");
        res.json();
      })
      .then((res) => {
        console.log("cookie passed");
        done();
      })
      .catch((err) => console.log(err));
  });

  // get articles for newly registerred user
  it("return a requested article, all requested articles by a user, or array of articles in the loggedInUser feed", (done) => {
    console.log("7");
    fetch(url("/articles"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        // let currNumOfArticles = 0; // newly registered user has no article
        // prevNumOfArticles = currNumOfArticles;
        // expect(res.status).toEqual(404)
        // // expect(currNumOfArticles >= 1).toBe(true);
        // console.log("get articles for newly registerred user tested")
        // done();
        let currNumOfArticles = res.articles.length;
        prevNumOfArticles = currNumOfArticles;
        expect(currNumOfArticles >= 1).toBe(true);
        console.log("get articles for newly registerred user tested");
        done();
      })
      .catch((err) => console.log(err));
  });

  // add article
  it("return a requested article, all requested articles by a user, or array of articles in the loggedInUser feed", (done) => {
    console.log("8");
    fetch(url("/article"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ text: "new article" }),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles.length).toEqual(prevNumOfArticles + 1);
        console.log("add article tested");
        done();
      })
      .catch((err) => console.log(err));
  });

  // get article w/ valid id
  it("return article with given id", (done) => {
    console.log("9");
    fetch(url("/articles/6376efaf2fda1dca9c90d4fe"), {
      // valid _id from mongoDB
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles.length).toEqual(1);
        console.log("get article w/ valid id tested");
        done();
      })
      .catch((err) => console.log(err));
  });

  // get article w/ invalid id
  it("return article with given id", (done) => {
    console.log("10");
    fetch(url("/articles/12345"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        expect(res.status).toEqual(404);
        console.log("get article w/ invalid id tested");
        done();
      })
      .catch((err) => console.log(err));
  });
});
