const dns = require('dns')
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const ConnectDB = require("./Config/Database");
const auth_router = require("./Routes/auth_route");
const profile_router = require('./Routes/profile_route');
const seller_router = require('./Routes/seller_route');
const admin_router = require("./Routes/admin_route");

const app = express();
const PORT = process.env.PORT || 8000;
ConnectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/auth", auth_router);
app.use("/profile",profile_router);
app.use("/seller",seller_router);
app.use("/admin",admin_router);
app.get("/", (req, res) => {
    res.send("Hello World! Server is running.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});