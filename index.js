const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

dotenv.config();
// Connecting to mongoose database
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB connection successfull")).catch((err)=>{
    console.log(err)
});

//To be able to send json text
app.use(express.json());
// Creating routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

// using express to build port
app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend server is running");
});