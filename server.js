const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const favicon = require("serve-favicon");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
require("ejs");
require("dotenv").config();

const indexRouter = require("./routes/index");
const signUpRouter = require("./routes/sign-up");
const logOutRouter = require("./routes/log-out");
const getPremiumRouter = require("./routes/get-premium");
const logInFailedRouter = require("./routes/log-in-failed");
const newMsgRouter = require("./routes/new-message");
const notFound = require("./middleware/404");
const defineCurrentUser = require("./middleware/local-current-user");

const app = express();
const port = process.env.PORT || 3030;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(methodOverride("_method"));

require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());
app.use(defineCurrentUser);

app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/get-premium", getPremiumRouter);
app.use("/log-out", logOutRouter);
app.use("/log-in-failed", logInFailedRouter);
app.use("/new-message", newMsgRouter);
app.use(notFound);

const start = async () => {
    mongoose.set("strictQuery", false);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database.");
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (err) {
        console.log(err);
    }
};

start();
