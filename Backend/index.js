const express = require("express");
const dotenv = require("dotenv").config();
const body_parser = require('body-parser');


const app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});