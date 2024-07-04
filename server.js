/********************************************************************************
 *  WEB322 – Assignment 04
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Hill Bhupendrabhai Patel Student ID: 132031220 Date: 4th July 2024
 *
 *  Published URL: ___________________________________________________________
 *
 ********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require("path");
const axios = require("axios");
const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// Configuring EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serving static files from the 'public' directory
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const quote = response.data.content;
    const author = response.data.author;
    res.render("home", { quote, author });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.render("home", { quote: "Error fetching quote", author: "" });
  }
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

app.get("/lego/sets", async (req, res) => {
  try {
    if (req.query.theme) {
      let sets = await legoData.getSetsByTheme(req.query.theme);
      if (sets.length === 0)
        throw new Error(`No sets found for theme: ${req.query.theme}`);
      res.render("sets", { sets, page: "/lego/sets" });
    } else {
      let sets = await legoData.getAllSets();
      if (sets.length === 0) throw new Error("No sets found.");
      res.render("sets", { sets, page: "/lego/sets" });
    }
  } catch (err) {
    res.status(404).render("404", { message: err.message });
  }
});

app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    if (!set) throw new Error(`Set with number ${req.params.num} not found.`);
    res.render("set", { set });
  } catch (err) {
    res.status(404).render("404", { message: err.message });
  }
});

// Handling 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for.",
  });
});

// Starting the server
legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
  });
});
