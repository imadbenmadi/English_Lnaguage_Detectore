const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { corsOptions } = require("../config/app.conf");
const credentials = require("./credentials.middleware");
const errorHandler = require("./ErrorHandler.middleware");

module.exports = (app) => {
    app.use(express.json());
    // app.use(errorHandler);
    app.use(cookieParser());
    app.use(credentials);
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};
