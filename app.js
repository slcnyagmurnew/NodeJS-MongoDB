const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

const mainRoutes = require("./router/mainRoutes");

require("dotenv").config();

const ConnectString = process.env.ATLAS_URI;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(mainRoutes);

mongoose
    .connect(ConnectString, { useNewUrlParser: true })
    .then(() => {
        console.log("Database connection succeeded.");
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
